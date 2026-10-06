# Black Hole

Black Hole is a local-first Manifest V3 Chrome extension for saving groups of browser tabs as reusable named workspaces.

## Features

- Create unlimited capsules with name, description, icon, and color.
- Save all supported tabs from the current window into a selected capsule.
- Save & Close: storage is updated successfully before tabs are closed.
- Open a capsule in the current window or a new window.
- Preserve saved website order.
- Edit websites, remove individual websites, and drag-and-drop reorder them.
- Add the active tab to an existing capsule.
- Rename and duplicate capsules.
- Favorite/pin capsules to the top.
- Search by capsule name and description.
- Delete capsules without touching currently open tabs.
- JSON import/export with validation.
- Settings for duplicate prevention, confirmation, display, default opening mode, and theme.
- Light/dark/system-friendly UI.
- Keyboard command: Ctrl+Shift+C (Mac: Command+Shift+C) where supported by Chrome.
- Local-only storage using `chrome.storage.local`.

## Installation

1. Put this project in a local folder.
2. Open Google Chrome.
3. Navigate to `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the `BlackHole` folder.
7. Pin Black Hole from the Extensions menu.

No Node.js, Python, database, backend, or build step is required.

## Usage

### Create and save
Open the extension, choose **New Capsule**, name it, then use **Save Current Tabs** or **Save & Close**. Saving collects only normal web URLs (`http`, `https`, `ftp`). Chrome-internal pages such as `chrome://` are skipped because they cannot be reopened by a normal tab URL.

### Open
Choose **Open Capsule**. The extension opens websites in saved order. **Open in New Window** is available from the capsule menu.

### Edit
Use **Edit** or the capsule menu to remove websites, reorder them, add the active tab, rename, duplicate, favorite, or delete.

### Import/export
Use the Settings page from the gear button. Exports are JSON files with version metadata. Imports validate the version, capsule structure, and website URLs before adding data. Existing capsule names are not overwritten; imported duplicates receive a unique `Copy` suffix.

## Project structure

```text
BlackHole/
├── manifest.json
├── README.md
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── background/
│   └── service-worker.js
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
├── utils/
│   ├── helpers.js
│   ├── storage.js
│   └── tabs.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── package/
    └── README.md
```

## Permissions

- `tabs`: read the current window's tabs when the user explicitly saves them and create tabs when a capsule is opened.
- `storage`: persist capsule data and settings locally.

The extension does not request history, cookies, scripting, webRequest, or remote-host permissions.

## Privacy

Black Hole stores saved capsule information locally using Chrome Storage. No browsing data is sent to an external server. It does not collect browsing history, passwords, cookies, personal information, or website content.

## Data model

The storage layer keeps a versioned object containing `capsules` and `settings`. Each capsule has a stable ID and each website has its own stable ID; array positions are not used as permanent identifiers.

## Testing checklist

1. Create a capsule with three web tabs: expect three saved websites.
2. Open the capsule: expect all three sites in saved order.
3. Use Save & Close: verify storage succeeds before tabs disappear.
4. Delete a capsule: verify open tabs remain untouched.
5. Restart Chrome: verify saved capsules remain.
6. Create 10+ capsules and verify cards render and search works.
7. Try adding an existing URL: duplicate prevention should warn.
8. Import malformed JSON: a friendly error should appear and data should remain intact.
9. Import valid JSON: capsules should be restored with collision-safe names.
10. Open a capsule containing an unsupported/invalid URL: other sites should still open.
11. Switch system/light/dark settings and verify readability.
12. Drag websites into a different order and reopen the capsule.

## Troubleshooting

- **Extension does not load:** open `chrome://extensions`, inspect the extension's Errors section, and reload after changes.
- **Chrome internal page was skipped:** this is intentional; `chrome://` and extension pages cannot be safely reopened as ordinary saved websites.
- **Keyboard shortcut does not open the popup:** Chrome may reserve or restrict a shortcut. Visit `chrome://extensions/shortcuts` and assign an available shortcut. Newer Chrome versions support `chrome.action.openPopup`; older versions may not.
- **Favicon missing:** the saved URL remains valid and a missing favicon never blocks the capsule.

## Development

The popup owns presentation and user actions. `utils/storage.js` isolates persistence so a future sync implementation can replace local storage without rewriting the UI. `utils/tabs.js` owns tab collection and opening. The service worker only handles lifecycle initialization and the optional command.

## Chrome Web Store readiness

Before publication, add production PNG artwork/screenshots, a store privacy disclosure matching the actual extension behavior, support/contact details, and final store listing metadata. The source itself has no external runtime dependency.
