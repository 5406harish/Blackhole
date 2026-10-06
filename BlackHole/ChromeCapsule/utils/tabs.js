import { makeId, isSupportedUrl, normalizeUrl, safeFaviconUrl } from './helpers.js';

export async function getCurrentWindowTabs() {
  return chrome.tabs.query({ currentWindow: true });
}

export function tabToWebsite(tab) {
  return {
    id: makeId('site'),
    title: tab.title || tab.url || 'Untitled tab',
    url: tab.url || '',
    favicon: safeFaviconUrl(tab),
    pinned: Boolean(tab.pinned),
    order: Number.isInteger(tab.index) ? tab.index : 0
  };
}

export function collectSupportedTabs(tabs) {
  const supported = [];
  const skipped = [];
  for (const tab of tabs) {
    if (tab.url && isSupportedUrl(tab.url)) supported.push(tabToWebsite(tab));
    else skipped.push(tab);
  }
  supported.sort((a, b) => a.order - b.order).forEach((site, index) => site.order = index);
  return { supported, skipped };
}

export function sameUrl(a, b) {
  return normalizeUrl(a) === normalizeUrl(b);
}

export async function openWebsites(websites, { newWindow = false } = {}) {
  const ordered = [...websites].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!ordered.length) return { created: [], failed: [] };
  const created = [];
  const failed = [];

  if (newWindow) {
    let windowId = null;
    try {
      const first = await chrome.windows.create({ url: ordered[0].url, focused: true });
      windowId = first.id;
      created.push(ordered[0]);
    } catch (error) {
      failed.push({ website: ordered[0], error });
    }
    if (windowId !== null) {
      for (const site of ordered.slice(1)) {
        try {
          await chrome.tabs.create({ windowId, url: site.url, active: false });
          created.push(site);
        } catch (error) {
          failed.push({ website: site, error });
        }
      }
    }
  } else {
    for (const site of ordered) {
      try {
        await chrome.tabs.create({ url: site.url, active: false });
        created.push(site);
      } catch (error) {
        failed.push({ website: site, error });
      }
    }
  }
  return { created, failed };
}
