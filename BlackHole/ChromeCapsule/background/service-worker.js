import { getData } from '../utils/storage.js';

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'open-capsule') return;
  try {
    if (chrome.action.openPopup) {
      await chrome.action.openPopup();
      return;
    }
  } catch (error) {
    console.warn('Could not open popup from command:', error);
  }
  // Chrome versions that do not support action.openPopup cannot programmatically
  // display an extension popup. The command remains safely registered.
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await getData();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});
