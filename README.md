# 🕳️ Black Hole

### Multi-Tab Workspace Manager for Google Chrome

**Black Hole** is a modern Chrome Extension that lets you save multiple websites together as named **Capsules**, reopen them whenever you need, and keep those capsules synchronized with the browser workspace as you work.

Instead of repeatedly opening the same collection of websites, you can create a capsule such as:

* 🎓 College
* 💼 Work
* 💻 Project Development
* 📚 Placement Preparation
* 🔬 Research
* 🎵 Personal
* 🎮 Entertainment

Open a capsule once, continue working, and Black Hole can keep the capsule updated with the changes made to its active tabs.

---

## ✨ Features

### 📦 Capsule Management

* Create unlimited capsules
* Give each capsule a custom name
* Add descriptions
* Choose capsule icons
* Choose capsule colors
* Rename capsules
* Duplicate capsules
* Delete capsules
* Favorite/pin capsules where supported
* Search capsules by name or description

---

### 🌐 Save Multiple Websites

Save multiple currently open Chrome tabs into one capsule.

Each saved website can contain:

* Website title
* URL
* Favicon
* Tab order
* Pinned state
* Unique website ID

Example:

```text
Placement Preparation
│
├── LeetCode
├── HackerRank
├── GitHub
├── Gmail
├── ChatGPT
└── Google Docs
```

---

# 🔄 Live Capsule Synchronization

One of the main features of the latest Black Hole version is **live workspace synchronization**.

When you open a capsule, Black Hole can track the websites belonging to that active capsule.

This means the capsule can evolve as you work.

### Example

Suppose your capsule contains:

```text
My Project

├── GitHub
├── Google Docs
└── Gmail
```

You open the capsule.

Then you open:

```text
Stack Overflow
```

Black Hole can update the capsule:

```text
My Project

├── GitHub
├── Google Docs
├── Gmail
└── Stack Overflow
```

If you later close Google Docs, the workspace state can be synchronized so the capsule reflects the current workspace.

If you navigate a tracked tab from:

```text
GitHub
```

to:

```text
Stack Overflow
```

the capsule can update the corresponding website information.

### Workspace concept

```text
OPEN CAPSULE
      ↓
TRACK CAPSULE TABS
      ↓
USER WORKS WITH TABS
      ↓
ADD / REMOVE / NAVIGATE
      ↓
CAPSULE UPDATED
      ↓
OPEN CAPSULE AGAIN
      ↓
LATEST WORKSPACE RESTORED
```

This turns a capsule from a simple saved list into a **browser workspace that can evolve over time**.

---

# 🧹 Smart URL Deduplication

Black Hole automatically normalizes and removes duplicate website URLs when storing capsule websites.

For example:

```text
https://github.com
https://github.com/
https://github.com/#home
```

are treated as equivalent where the normalization rules apply.

Instead of storing:

```text
GitHub
GitHub
GitHub
```

Black Hole keeps a single entry.

### Result

```text
Before:

GitHub
GitHub
GitHub
Gmail
Gmail

After:

GitHub
Gmail
```

This keeps capsules clean and prevents unnecessary duplicate tabs.

---

# 📑 Sorted Website Storage

When websites are added or updated, Black Hole cleans and sorts the stored URL list.

This provides deterministic storage and makes the capsule easier to maintain.

Example:

```text
Before:

YouTube
GitHub
Google
ChatGPT

After:

ChatGPT
GitHub
Google
YouTube
```

Duplicate URLs are removed before sorting.

---

# 🚫 Already-Open Website Detection

Black Hole checks the websites currently open in Chrome before opening a capsule.

If a website from the capsule is already open, Black Hole does **not** create another copy.

### Example

Capsule:

```text
GitHub
Gmail
ChatGPT
YouTube
```

Currently open:

```text
Chrome
├── GitHub
└── Gmail
```

When the capsule is opened:

```text
GitHub       → Already open → Skip
Gmail        → Already open → Skip
ChatGPT      → Open
YouTube      → Open
```

Result:

```text
2 websites opened
2 websites already open
```

This prevents unnecessary duplicate tabs.

---

# 🌍 Cross-Window Duplicate Detection

The already-open URL check is not limited to the current Chrome window.

Black Hole checks tabs across Chrome windows.

For example:

```text
Window 1
├── Gmail
└── YouTube

Window 2
├── GitHub
└── Google Docs
```

If a capsule contains all four websites, Black Hole recognizes that they are already open and avoids creating duplicates.

---

# 💾 Save Current Tabs

Use:

```text
Save Current Tabs
```

to save the websites currently open in the active Chrome window.

Black Hole:

1. Reads the current tabs
2. Filters unsupported Chrome pages
3. Normalizes URLs
4. Removes duplicates
5. Sorts the websites
6. Saves the updated capsule

---

# 🔒 Save & Close

Black Hole provides:

```text
Save & Close
```

The operation follows a safe order:

```text
READ TABS
   ↓
SAVE CAPSULE
   ↓
CONFIRM STORAGE
   ↓
CLOSE TABS
```

The tabs are **not closed before the capsule is successfully saved**.

This helps prevent accidental data loss.

---

# 🚀 Open Capsule

Click:

```text
Open Capsule
```

to restore the websites belonging to a capsule.

Black Hole:

1. Loads the saved capsule
2. Cleans duplicate URLs
3. Normalizes URLs
4. Checks currently open tabs
5. Skips websites already open
6. Opens remaining websites
7. Continues even if one website fails
8. Updates capsule opening information

Example:

```text
Capsule
   ↓
Check existing tabs
   ↓
Remove duplicates
   ↓
Skip already-open websites
   ↓
Open remaining websites
   ↓
Update capsule
```

---

# 🪟 Open in New Window

Capsules can also be opened in a new Chrome window.

Example:

```text
Black Hole
     ↓
Open Capsule in New Window
     ↓
New Chrome Window
├── GitHub
├── Gmail
├── ChatGPT
└── Google Docs
```

Already-open websites are still detected and skipped according to the capsule-opening rules.

---

# ✏️ Edit Capsules

Capsules can be modified after creation.

Supported operations include:

* Rename capsule
* Change description
* Change icon
* Change color
* Add websites
* Remove websites
* Add current tab
* Reorder websites where supported
* Duplicate capsule
* Open capsule
* Open in new window
* Export capsule
* Delete capsule

---

# 🔗 Add Current Tab

The current browser tab can be added directly to an existing capsule.

Before storing it, Black Hole checks for duplicates.

Example:

```text
Capsule:

GitHub
Gmail
ChatGPT
```

Current tab:

```text
GitHub
```

Black Hole detects that GitHub already exists and prevents unnecessary duplication.

---

# 🗑️ Remove Websites

Individual websites can be removed from a capsule without deleting the entire capsule.

Removing a website from the saved capsule does **not** automatically close the corresponding browser tab.

---

# 📋 Capsule Duplication

Capsules can be duplicated.

Example:

```text
Project Development
        ↓
Duplicate
        ↓
Project Development Copy
```

The duplicated capsule receives its own unique ID and can be modified independently.

---

# 🔍 Capsule Search

Search capsules by:

* Name
* Description

Example:

```text
Search: project
```

Possible results:

```text
Project Development
AI Project
College Project
```

---

# 🌙 Dark & Light Mode

Black Hole supports a modern interface with:

* Dark mode
* Light mode
* System preference

The interface uses CSS variables and responsive styling to maintain consistent appearance.

---

# 📊 Capsule Information

Capsule cards can display information such as:

```text
🚀 Placement Preparation

8 websites

Last opened:
Today, 2:30 PM
```

Depending on the enabled features, capsule information can include:

* Website count
* Last opened time
* Open count
* Favorite status
* Capsule icon
* Capsule color

---

# 💾 Local Storage

Black Hole stores capsule information locally using:

```javascript
chrome.storage.local
```

The extension does not require a backend server for its core functionality.

Conceptual data structure:

```javascript
{
    capsules: [
        {
            id: "unique-id",
            name: "Placement Preparation",
            description: "Placement preparation websites",
            icon: "🎓",
            color: "#6366f1",

            websites: [
                {
                    id: "website-id",
                    title: "LeetCode",
                    url: "https://leetcode.com/",
                    favicon: "...",
                    pinned: false,
                    order: 0
                }
            ],

            createdAt: 123456789,
            updatedAt: 123456789,
            lastOpenedAt: 123456789,
            openCount: 5
        }
    ]
}
```

Other capsules are preserved when one capsule is modified.

---

# 🔐 Privacy

Black Hole is designed around local-first storage.

The extension does **not intentionally collect**:

* Passwords
* Cookies
* Browsing history
* Website content
* Personal information

Saved capsule data remains in Chrome's local extension storage.

No external backend server is required for the current version.

The extension only works with website information required for its capsule functionality.

---

# 🛡️ Security

Black Hole follows Chrome Extension security practices.

The project avoids:

```javascript
eval()
```

and unsafe dynamic script execution.

The extension does not intentionally inject arbitrary remote JavaScript.

User-controlled content should be handled using safe DOM APIs such as:

```javascript
textContent
```

where appropriate.

---

# ⚡ Performance

Black Hole is designed to remain lightweight.

The project avoids unnecessary:

* API calls
* Storage operations
* DOM rebuilding
* External libraries
* Network services

The architecture is designed to support:

```text
5 capsules
20 capsules
100 capsules
500+ websites
```

without requiring a backend.

---

# 🌐 Supported Website Handling

Black Hole avoids saving unsupported/internal Chrome pages such as:

```text
chrome://
chrome-extension://
edge://
about:
```

These pages generally cannot be restored like normal websites.

Unsupported URLs are skipped rather than causing the entire save operation to fail.

---

# ⭐ Favicons

Black Hole displays website favicons where available.

If a favicon cannot be loaded, a fallback icon can be displayed instead.

Example:

```text
🌐
```

A missing favicon should not prevent the website from being stored or opened.

---

# 📥 Import & Export

Capsules can be exported as JSON.

Example:

```json
{
    "version": 1,
    "exportedAt": 123456789,
    "capsules": []
}
```

Import validation checks the structure of the imported data before restoring capsules.

Invalid files should produce a friendly error instead of breaking the extension.

---

# ⚙️ Settings

The Options page can provide settings such as:

### General

* Ask before deleting capsules
* Prevent duplicate URLs
* Open capsules in a new window by default
* Show website count
* Show last opened time

### Appearance

```text
System
Light
Dark
```

### Data

```text
Export Capsules
Import Capsules
Delete All Capsules
```

Destructive operations require confirmation.

---

# 🏗️ Project Structure

```text
ChromeCapsule/
│
├── manifest.json
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── background/
│   └── service-worker.js
│
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
│
├── utils/
│   ├── storage.js
│   ├── tabs.js
│   └── helpers.js
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── README.md
│
└── package/
    └── README.md
```

---

# 🧩 Architecture

Black Hole separates its main responsibilities.

```text
                BLACK HOLE
                     │
        ┌────────────┼────────────┐
        │            │            │
      Popup       Storage        Tabs
        │            │            │
        ↓            ↓            ↓
      UI       chrome.storage   Chrome APIs
        │            │            │
        └────────────┼────────────┘
                     │
               Capsule State
                     │
                     ↓
              Live Workspace
```

### `popup/`

Responsible for:

* User interface
* Capsule cards
* Search
* Buttons
* Modals
* User interactions

### `utils/storage.js`

Responsible for:

* Reading capsules
* Saving capsules
* Updating capsules
* Deleting capsules
* Import/export support

### `utils/tabs.js`

Responsible for:

* Reading browser tabs
* Filtering supported URLs
* URL normalization
* Duplicate detection
* Sorting
* Opening websites
* Detecting already-open websites
* Workspace tab handling

### `background/service-worker.js`

Responsible for background Chrome Extension functionality and event-driven operations where required.

### `options/`

Responsible for:

* Settings
* Import/export
* Appearance preferences
* Data management

---

# 🔧 Installation

## 1. Download the project

Download or clone the Black Hole project.

## 2. Extract the project

Extract the ZIP file.

You should have a structure similar to:

```text
BlackHole/
└── ChromeCapsule/
    ├── manifest.json
    ├── popup/
    ├── background/
    ├── options/
    ├── utils/
    └── icons/
```

## 3. Open Chrome Extensions

Open:

```text
chrome://extensions
```

## 4. Enable Developer Mode

Turn on:

```text
Developer mode
```

## 5. Load the extension

Click:

```text
Load unpacked
```

Select:

```text
ChromeCapsule
```

the folder containing:

```text
manifest.json
```

## 6. Pin Black Hole

Open the Chrome Extensions menu and pin **Black Hole** to the toolbar.

---

# 🧪 Testing

## Test 1 — Create Capsule

Open several websites.

Create:

```text
My Work
```

Save the current tabs.

Expected:

```text
My Work
├── Website 1
├── Website 2
└── Website 3
```

---

## Test 2 — Open Capsule

Close the saved tabs.

Open the capsule.

Expected:

```text
All saved websites reopen.
```

---

## Test 3 — Already-Open Detection

Open one saved website manually.

Then open the capsule.

Expected:

```text
Already-open website → skipped
Remaining websites → opened
```

No unnecessary duplicate tab should be created.

---

## Test 4 — Duplicate URLs

Try adding:

```text
https://github.com
```

and:

```text
https://github.com/
```

Expected:

```text
Only one GitHub entry is stored.
```

---

## Test 5 — Add Website to Active Workspace

Open a capsule.

Then open another supported website.

Expected:

```text
New website
     ↓
Detected by workspace synchronization
     ↓
Capsule updated
```

---

## Test 6 — Navigate a Tracked Tab

Open a capsule.

Navigate one tracked website to another URL.

Expected:

```text
Old URL
   ↓
New URL
   ↓
Capsule updated
```

---

## Test 7 — Close a Tracked Tab

Open a capsule.

Close one of its tracked tabs.

Expected:

```text
Closed tab
     ↓
Workspace state updated
```

---

## Test 8 — Save & Close

Use:

```text
Save & Close
```

Expected:

```text
Save successfully
      ↓
Tabs close
```

Tabs should not be closed before saving succeeds.

---

## Test 9 — Delete Capsule

Delete a capsule.

Expected:

```text
Capsule removed
```

Existing Chrome tabs must remain open.

---

## Test 10 — Browser Restart

Restart Chrome.

Expected:

```text
Saved capsules remain available.
```

---

## Test 11 — Search

Create multiple capsules and search by name.

Expected:

```text
Only matching capsules appear.
```

---

## Test 12 — Invalid URL

Add a problematic/invalid website.

Expected:

```text
Invalid website
      ↓
Handled gracefully
      ↓
Other websites continue opening
```

---

## Test 13 — Import/Export

Export capsules.

Then import the generated JSON file.

Expected:

```text
Capsules restored successfully.
```

---

## Test 14 — Theme

Test:

```text
System
Light
Dark
```

Expected:

```text
UI remains readable and properly styled.
```

---

# ⚠️ Important Live-Sync Consideration

Live workspace synchronization depends on identifying which browser tabs belong to the currently opened capsule.

Therefore, Black Hole should treat an **active capsule session** carefully.

A future refinement can provide:

```text
Auto-update capsule
ON / OFF
```

This gives users control over automatic synchronization and prevents unwanted changes when they are working with unrelated tabs.

---

# 🚧 Known Limitations

Chrome controls certain browser/internal pages that extensions cannot treat like normal websites.

Examples include:

```text
chrome://
chrome-extension://
edge://
about:
```

These pages may not be suitable for capsule restoration.

Also, Chrome extension APIs impose restrictions on how tabs and windows can be monitored and manipulated.

The live-sync system should therefore gracefully handle:

* Tabs being closed externally
* Chrome restarting
* Windows being closed
* Unsupported URLs
* Navigation failures
* Permission limitations
* Failed tab creation

---

# 🔮 Future Improvements

Possible future versions can add:

### ☁️ Cloud Synchronization

Sync capsules between devices.

Possible architecture:

```text
Black Hole
     ↓
Storage abstraction
     ↓
Chrome Storage Sync / Cloud
```

The current storage layer is kept isolated so future synchronization can be added without completely rewriting the UI.

### 🤖 Smart Workspace Detection

Automatically identify groups of related websites.

Example:

```text
GitHub
Stack Overflow
ChatGPT
Google Docs
```

could be suggested as:

```text
Software Development
```

### 🕘 Workspace History

Maintain previous capsule versions.

Example:

```text
Project Work
│
├── Current
├── Yesterday
└── Last Week
```

### 📈 Capsule Statistics

Example:

```text
Placement Preparation

12 websites
Opened 28 times
Last opened today
```

### 🔄 Advanced Session Recovery

Restore more workspace information such as:

* Window relationships
* Pinned state
* Tab positions
* Multiple windows
* Workspace snapshots

---

# 📄 Permissions

Black Hole uses Chrome permissions only where required.

### `tabs`

Used to:

* Read currently open tabs
* Obtain website URLs
* Detect already-open websites
* Open saved websites
* Manage capsule workspace tabs

### `storage`

Used to:

* Store capsules
* Store settings
* Preserve capsule information between browser sessions

The extension does not require a traditional backend server.

---

# 🛠️ Development

Black Hole uses:

```text
HTML5
CSS3
JavaScript ES6+
Chrome Extension Manifest V3
Chrome Extension APIs
```

No Node.js backend is required.

No Python backend is required.

No database server is required.

No Firebase backend is required.

The architecture is intentionally lightweight and local-first.

---

# 🤝 Contributing

Contributions are welcome.

When contributing:

1. Keep the existing architecture clean.
2. Avoid unnecessary dependencies.
3. Preserve local-first functionality.
4. Do not introduce unnecessary permissions.
5. Test changes against existing capsule functionality.
6. Do not break other capsules when modifying one capsule.
7. Maintain Chrome Manifest V3 compatibility.

---

# 📜 License

Add your preferred open-source license before publishing the project publicly.

For example:

```text
MIT License
```

---

# 👨‍💻 Author

**Harish**

Computer Science and Business Systems

---

# 🕳️ Black Hole

### Save your workspace.

### Continue your work.

### Reopen everything when you need it.

> **Black Hole — Your browser workspace, preserved.**
