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

// Remove duplicate URLs and keep one canonical entry per website.
// Sorting by normalized URL makes storage deterministic and guarantees that
// opening a capsule later follows the same cleaned order.
export function dedupeAndSortWebsites(websites = []) {
  const seen = new Set();
  const unique = [];

  for (const site of websites) {
    const url = normalizeUrl(site?.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    unique.push({ ...site, url });
  }

  unique.sort((a, b) => a.url.localeCompare(b.url, undefined, { sensitivity: 'base' }));
  unique.forEach((site, index) => { site.order = index; });
  return unique;
}

async function getOpenNormalizedUrls() {
  const tabs = await chrome.tabs.query({});
  return new Set(
    tabs
      .map(tab => tab?.url)
      .filter(Boolean)
      .map(url => normalizeUrl(url))
  );
}

export async function openWebsites(websites, { newWindow = false } = {}) {
  const stored = dedupeAndSortWebsites(websites);
  const allOpenTabs = await chrome.tabs.query({});
  const openUrls = new Set(
    allOpenTabs
      .map(tab => tab?.url)
      .filter(Boolean)
      .map(url => normalizeUrl(url))
  );
  const openTabsByUrl = new Map();
  for (const tab of allOpenTabs) {
    if (!tab?.url) continue;
    const normalized = normalizeUrl(tab.url);
    if (!openTabsByUrl.has(normalized)) openTabsByUrl.set(normalized, []);
    openTabsByUrl.get(normalized).push({ id: tab.id, windowId: tab.windowId, url: normalized });
  }
  const skippedAlreadyOpen = [];
  const ordered = [];

  for (const site of stored) {
    if (openUrls.has(normalizeUrl(site.url))) {
      skippedAlreadyOpen.push({ ...site, openTabs: openTabsByUrl.get(normalizeUrl(site.url)) || [] });
    } else {
      ordered.push(site);
    }
  }

  if (!ordered.length) {
    return { created: [], failed: [], skippedAlreadyOpen, openTabs: [...openTabsByUrl.values()].flat() };
  }

  const created = [];
  const failed = [];

  if (newWindow) {
    let windowId = null;
    try {
      const first = await chrome.windows.create({ url: ordered[0].url, focused: true });
      windowId = first.id;
      created.push(ordered[0]);
      ordered[0].createdTabId = first.tabs?.[0]?.id ?? null;
      ordered[0].createdWindowId = first.id ?? null;
    } catch (error) {
      failed.push({ website: ordered[0], error });
    }
    if (windowId !== null) {
      for (const site of ordered.slice(1)) {
        try {
          const createdTab = await chrome.tabs.create({ windowId, url: site.url, active: false });
          site.createdTabId = createdTab.id;
          site.createdWindowId = windowId;
          created.push(site);
        } catch (error) {
          failed.push({ website: site, error });
        }
      }
    }
  } else {
    for (const site of ordered) {
      try {
        const createdTab = await chrome.tabs.create({ url: site.url, active: false });
        site.createdTabId = createdTab.id;
        site.createdWindowId = createdTab.windowId;
        created.push(site);
      } catch (error) {
        failed.push({ website: site, error });
      }
    }
  }
  return { created, failed, skippedAlreadyOpen, openTabs: [...openTabsByUrl.values()].flat() };
}
