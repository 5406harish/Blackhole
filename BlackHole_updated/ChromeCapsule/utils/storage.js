import { DEFAULT_SETTINGS, makeId, sanitizeText } from './helpers.js';

const KEY = 'chromeCapsuleData';

function defaultData() {
  return { version: 1, capsules: [], settings: { ...DEFAULT_SETTINGS } };
}

export async function getData() {
  try {
    const result = await chrome.storage.local.get(KEY);
    const data = result[KEY] || defaultData();
    return {
      version: 1,
      capsules: Array.isArray(data.capsules) ? data.capsules : [],
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) }
    };
  } catch (error) {
    console.error('Black Hole storage read failed:', error);
    throw new Error('Unable to read Black Hole storage.');
  }
}

export async function saveData(data) {
  try {
    await chrome.storage.local.set({ [KEY]: data });
  } catch (error) {
    console.error('Black Hole storage write failed:', error);
    throw new Error('Unable to save Black Hole data.');
  }
}

export async function updateData(mutator) {
  const data = await getData();
  const next = await mutator(structuredClone(data));
  await saveData(next);
  return next;
}

export function createCapsule({ name, description = '', icon = '💊', color = '#6366f1', websites = [] }) {
  const now = Date.now();
  return {
    id: makeId('capsule'),
    name: sanitizeText(name),
    description: sanitizeText(description),
    icon,
    color,
    websites: websites.map((site, index) => ({ ...site, id: site.id || makeId('site'), order: index })),
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: null,
    openCount: 0,
    favorite: false
  };
}

export async function createCapsuleAndSave(input) {
  const data = await getData();
  const duplicate = data.capsules.find(c => c.name.toLowerCase() === input.name.trim().toLowerCase());
  if (duplicate) throw new Error('A capsule with this name already exists.');
  const capsule = createCapsule(input);
  data.capsules.push(capsule);
  await saveData(data);
  return capsule;
}
