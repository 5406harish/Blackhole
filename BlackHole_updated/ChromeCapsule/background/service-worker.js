import { getData, saveData } from '../utils/storage.js';
import { isSupportedUrl, normalizeUrl, safeFaviconUrl } from '../utils/helpers.js';

const SESSION_KEY = 'activeCapsuleSessions';
const SAVE_DEBOUNCE_MS = 350;
const pendingSaves = new Map();

async function getSessions() {
  const result = await chrome.storage.local.get(SESSION_KEY);
  return Array.isArray(result[SESSION_KEY]) ? result[SESSION_KEY] : [];
}

async function saveSessions(sessions) {
  await chrome.storage.local.set({ [SESSION_KEY]: sessions });
}

function websiteFromTab(tab, order = 0, existing = null) {
  return {
    id: existing?.id || `site_${tab.id}_${Date.now()}`,
    title: tab.title || tab.url || existing?.title || 'Untitled tab',
    url: normalizeUrl(tab.url || existing?.url || ''),
    favicon: safeFaviconUrl(tab) || existing?.favicon || '',
    pinned: Boolean(tab.pinned),
    order
  };
}

function findCapsule(data, capsuleId) {
  return data.capsules.find(c => c.id === capsuleId);
}

function scheduleCapsuleSave(capsuleId) {
  clearTimeout(pendingSaves.get(capsuleId));
  const timer = setTimeout(async () => {
    pendingSaves.delete(capsuleId);
    try {
      const data = await getData();
      const capsule = findCapsule(data, capsuleId);
      if (!capsule) return;
      capsule.updatedAt = Date.now();
      await saveData(data);
    } catch (error) {
      console.error('Black Hole live sync save failed:', error);
    }
  }, SAVE_DEBOUNCE_MS);
  pendingSaves.set(capsuleId, timer);
}

async function registerSession(message) {
  const { capsuleId, windowId, tabIds = [] } = message;
  if (!capsuleId || !Number.isInteger(windowId)) return;

  const sessions = await getSessions();
  const withoutWindow = sessions.filter(s => s.windowId !== windowId);
  withoutWindow.push({
    capsuleId,
    windowId,
    tabIds: [...new Set(tabIds.filter(Number.isInteger))],
    updatedAt: Date.now()
  });
  await saveSessions(withoutWindow);

  // Bind the actual Chrome tab IDs to the websites in the capsule. This lets
  // later navigation/close events update the correct saved website.
  for (const tabId of [...new Set(tabIds.filter(Number.isInteger))]) {
    try {
      const tab = await chrome.tabs.get(tabId);
      const session = { capsuleId, windowId, tabIds: [...new Set(tabIds)] };
      await syncTabIntoCapsule(tab, session);
    } catch (error) {
      // The tab may have closed between opening the capsule and registration.
    }
  }
}

async function unregisterCapsule(capsuleId) {
  const sessions = await getSessions();
  await saveSessions(sessions.filter(s => s.capsuleId !== capsuleId));
}

async function getSessionForTab(tabId, windowId) {
  const sessions = await getSessions();
  return sessions.find(s => s.windowId === windowId && s.tabIds.includes(tabId)) || null;
}

async function getSessionForWindow(windowId) {
  const sessions = await getSessions();
  return sessions.find(s => s.windowId === windowId) || null;
}

async function syncTabIntoCapsule(tab, session) {
  if (!session || !tab?.id) return;

  const data = await getData();
  const capsule = findCapsule(data, session.capsuleId);
  if (!capsule) return;

  const supported = Boolean(tab.url && isSupportedUrl(tab.url));
  const existingIndex = capsule.websites.findIndex(site => session.tabIds.includes(tab.id) && site.tabId === tab.id);
  const url = supported ? normalizeUrl(tab.url) : '';

  if (!supported) {
    // Keep newly-created unsupported tabs in the live session so that if the
    // user navigates them to a normal website, the new URL is captured.
    if (!session.tabIds.includes(tab.id)) {
      session.tabIds.push(tab.id);
      const sessions = await getSessions();
      await saveSessions(sessions.map(s => s.windowId === session.windowId && s.capsuleId === session.capsuleId
        ? { ...s, tabIds: [...new Set(session.tabIds)], updatedAt: Date.now() }
        : s));
    }
    if (existingIndex >= 0) {
      capsule.websites.splice(existingIndex, 1);
      capsule.websites.forEach((site, index) => site.order = index);
      capsule.updatedAt = Date.now();
      await saveData(data);
    }
    return;
  }

  const duplicateIndex = capsule.websites.findIndex((site, index) => index !== existingIndex && normalizeUrl(site.url) === url);

  if (duplicateIndex >= 0) {
    if (existingIndex >= 0) capsule.websites.splice(existingIndex, 1);
    capsule.websites[duplicateIndex].tabId = tab.id;
    capsule.websites[duplicateIndex].title = tab.title || capsule.websites[duplicateIndex].title;
    capsule.websites[duplicateIndex].favicon = safeFaviconUrl(tab) || capsule.websites[duplicateIndex].favicon;
    capsule.websites[duplicateIndex].pinned = Boolean(tab.pinned);
  } else if (existingIndex >= 0) {
    const existing = capsule.websites[existingIndex];
    capsule.websites[existingIndex] = websiteFromTab(tab, existing.order, { ...existing, tabId: tab.id });
  } else {
    capsule.websites.push(websiteFromTab(tab, capsule.websites.length, { tabId: tab.id }));
    session.tabIds.push(tab.id);
  }

  // Keep the live capsule deterministic and duplicate-free.
  const seen = new Set();
  capsule.websites = capsule.websites.filter(site => {
    const normalized = normalizeUrl(site.url);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    site.url = normalized;
    return true;
  });
  capsule.websites.sort((a, b) => a.url.localeCompare(b.url, undefined, { sensitivity: 'base' }));
  capsule.websites.forEach((site, index) => site.order = index);
  capsule.updatedAt = Date.now();

  const sessions = await getSessions();
  const next = sessions.map(s => s.windowId === session.windowId && s.capsuleId === session.capsuleId ? {
    ...s,
    tabIds: [...new Set(session.tabIds)],
    updatedAt: Date.now()
  } : s);
  await saveSessions(next);
  await saveData(data);
}

async function removeTabFromCapsule(tabId, windowId) {
  const sessions = await getSessions();
  const session = sessions.find(s => s.windowId === windowId && s.tabIds.includes(tabId));
  if (!session) return;

  const data = await getData();
  const capsule = findCapsule(data, session.capsuleId);
  if (!capsule) return;

  const before = capsule.websites.length;
  capsule.websites = capsule.websites.filter(site => site.tabId !== tabId);
  capsule.websites.forEach((site, index) => site.order = index);

  const updatedSessions = sessions.map(s => s === session ? {
    ...s,
    tabIds: s.tabIds.filter(id => id !== tabId),
    updatedAt: Date.now()
  } : s);

  if (capsule.websites.length !== before) {
    capsule.updatedAt = Date.now();
    await saveData(data);
  }
  await saveSessions(updatedSessions);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'registerCapsuleSession') {
    registerSession(message).then(() => sendResponse({ ok: true })).catch(error => {
      console.error(error);
      sendResponse({ ok: false, error: error.message });
    });
    return true;
  }
  if (message?.type === 'unregisterCapsule') {
    unregisterCapsule(message.capsuleId).then(() => sendResponse({ ok: true })).catch(error => {
      console.error(error);
      sendResponse({ ok: false, error: error.message });
    });
    return true;
  }
});

chrome.tabs.onCreated.addListener(async tab => {
  if (!tab?.windowId || !tab.id) return;
  const session = await getSessionForWindow(tab.windowId);
  if (!session) return;
  await syncTabIntoCapsule(tab, session);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab?.windowId) return;
  if (!changeInfo.url && !changeInfo.title && !changeInfo.favIconUrl && changeInfo.pinned === undefined) return;
  const session = await getSessionForTab(tabId, tab.windowId);
  if (!session) return;
  await syncTabIntoCapsule(tab, session);
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  await removeTabFromCapsule(tabId, removeInfo.windowId);
});

chrome.windows.onRemoved.addListener(async windowId => {
  const sessions = await getSessions();
  const session = sessions.find(s => s.windowId === windowId);
  if (!session) return;

  // A closed workspace window represents a closed workspace. Keep its last
  // saved websites, but stop live tracking for that window.
  await saveSessions(sessions.filter(s => s.windowId !== windowId));
});

async function cleanupSessions() {
  const sessions = await getSessions();
  const windows = await chrome.windows.getAll({ populate: false });
  const existingWindowIds = new Set(windows.map(w => w.id));
  const clean = sessions.filter(s => existingWindowIds.has(s.windowId));
  if (clean.length !== sessions.length) await saveSessions(clean);
}

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'open-capsule') return;
  try {
    if (chrome.action.openPopup) await chrome.action.openPopup();
  } catch (error) {
    console.warn('Could not open popup from command:', error);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await getData();
    await cleanupSessions();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});

chrome.runtime.onStartup.addListener(cleanupSessions);
