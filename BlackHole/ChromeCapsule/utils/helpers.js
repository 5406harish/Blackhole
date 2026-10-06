export const DEFAULT_SETTINGS = {
  askBeforeDelete: true,
  preventDuplicateUrls: true,
  openInNewWindowByDefault: false,
  showWebsiteCount: true,
  showLastOpened: true,
  theme: 'system'
};

export function makeId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}

export function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname === '/') url.pathname = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return String(value || '').trim().replace(/\/$/, '');
  }
}

export function isSupportedUrl(value) {
  try {
    const protocol = new URL(value).protocol;
    return ['http:', 'https:', 'ftp:'].includes(protocol);
  } catch {
    return false;
  }
}

export function domainFromUrl(value) {
  try { return new URL(value).hostname; } catch { return value || 'Unknown website'; }
}

export function escapeCsv(value) {
  return String(value ?? '').replaceAll('"', '""');
}

export function formatDate(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay ? `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function sanitizeText(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

export function getTheme(settings) {
  if (settings.theme !== 'system') return settings.theme;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function safeFaviconUrl(tab) {
  if (tab?.favIconUrl && isSupportedUrl(tab.favIconUrl)) return tab.favIconUrl;
  return '';
}
