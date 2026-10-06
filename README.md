# 🕳️ Black Hole

### Multi-Tab Workspace & Browser Session Manager for Google Chrome

**Black Hole** is a modern Google Chrome extension that helps you organize, save, and restore groups of browser tabs as reusable **Capsules**.

Instead of keeping dozens of tabs open, you can save a complete group of websites into a named workspace and reopen them whenever you need them.

> **Open → Organize → Save → Close → Restore**

---

## ✨ Features

### 📦 Capsule Management

* Create unlimited capsules
* Give each capsule a custom name
* Add a description
* Choose an icon
* Choose a capsule color
* Rename capsules
* Duplicate capsules
* Delete capsules safely
* Mark favorite capsules
* Search capsules by name or description

### 🌐 Tab Management

* Save all current browser tabs
* Save selected websites into a capsule
* Add the current tab to an existing capsule
* Remove individual websites
* Reorder websites using drag and drop
* Preserve website order
* Detect duplicate URLs
* Display website favicons
* Handle unavailable or unsupported pages safely

### 🚀 Restore Workspaces

Open an entire workspace with one click.

For example:

```text
Placement Preparation
│
├── LeetCode
├── HackerRank
├── GitHub
├── Gmail
├── LinkedIn
└── ChatGPT
```

Click **Open Capsule** and Black Hole restores the websites in their saved order.

You can also open a capsule in a **new Chrome window**.

### 💾 Save & Close

Black Hole provides a safe:

**Save & Close**

workflow.

```text
Current Tabs
     ↓
Save Successfully
     ↓
Verify Storage
     ↓
Close Tabs
```

Tabs are never closed before the capsule is successfully saved.

### 🔍 Search

Quickly find capsules using:

* Capsule name
* Description

Search results update dynamically as you type.

### 🌙 Dark & Light Mode

Black Hole supports:

* System theme
* Light mode
* Dark mode

The default theme follows the operating system preference.

### 📤 Import & Export

Export your capsules as JSON.

Example:

```json
{
  "version": 1,
  "exportedAt": 123456789,
  "capsules": []
}
```

You can later import the file and restore your saved workspaces.

### ⚙️ Settings

The settings page provides options for:

* Delete confirmation
* Duplicate URL prevention
* New-window behavior
* Website count visibility
* Last-opened information
* Theme selection
* Import
* Export
* Delete all capsules

---

# 🎯 Why Black Hole?

The idea behind **Black Hole** is simple:

> Put all your browser tabs into a workspace and pull them back whenever you need them.

A capsule acts like a temporary digital workspace.

For example:

```text
🕳️ BLACK HOLE

Capsules

🚀 Placement Preparation
💻 Project Development
🎓 College
🔬 Research
💼 Work
🎵 YouTube
🛒 Shopping
```

Each capsule stores its own collection of websites.

---

# 🛠️ Technology Stack

Black Hole is built using standard Chrome Extension technologies.

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| HTML5                 | Extension UI                  |
| CSS3                  | Styling and responsive design |
| JavaScript ES6+       | Application logic             |
| Chrome Extensions API | Browser integration           |
| Manifest V3           | Extension architecture        |
| `chrome.tabs`         | Tab management                |
| `chrome.storage`      | Local data storage            |
| `chrome.windows`      | Window management             |
| `chrome.commands`     | Keyboard shortcuts            |

No backend server is required.

---

# 🔒 Privacy

Black Hole is designed as a **local-first extension**.

Saved capsule information is stored locally using:

```text
chrome.storage.local
```

Black Hole does **not**:

* Collect browsing history
* Collect passwords
* Collect cookies
* Collect website content
* Send saved URLs to an external server
* Use Firebase
* Use a database server
* Require a backend
* Track user activity

The extension only saves websites when the user explicitly chooses to save them.

---

# 📁 Project Structure

```text
BlackHole/
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
├── package/
│   └── README.md
│
└── README.md
```

---

# 🚀 Installation

## 1. Download the Project

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/black-hole.git
```

Or download the repository as a ZIP file.

---

## 2. Open Chrome Extensions

Open Google Chrome and navigate to:

```text
chrome://extensions
```

---

## 3. Enable Developer Mode

Enable:

```text
Developer mode
```

from the top-right corner.

---

## 4. Load the Extension

Click:

```text
Load unpacked
```

Select the extracted:

```text
BlackHole
```

project folder.

---

## 5. Pin Black Hole

Click the Chrome Extensions icon:

```text
🧩
```

Find:

```text
Black Hole
```

and pin it to the toolbar.

---

# 📖 Usage

## Create a Capsule

1. Open the websites you want to save.
2. Click the **Black Hole** extension.
3. Click:

```text
+ New Capsule
```

4. Enter a capsule name.
5. Optionally add a description.
6. Select an icon and color.
7. Create the capsule.
8. Save the current tabs.

---

## Save Current Tabs

Open the websites you want to keep.

Example:

```text
GitHub
ChatGPT
Google Docs
Gmail
LeetCode
```

Open Black Hole and select:

```text
Save Current Tabs
```

The websites are stored inside the selected capsule.

---

# 💾 Save & Close

If you want to save your current work and close the tabs:

```text
Save & Close
```

Black Hole first saves the websites.

Only after successful storage does it close the tabs.

This prevents accidental data loss.

---

# 🔄 Open a Capsule

Open Black Hole.

Find your capsule:

```text
🚀 Placement Preparation
```

Click:

```text
Open Capsule
```

All saved websites will be reopened.

---

# 🪟 Open in New Window

You can also choose:

```text
Open in New Window
```

Black Hole creates a new Chrome window and restores the capsule inside it.

Example:

```text
Black Hole
     ↓
Placement Capsule
     ↓
New Chrome Window
     ├── LeetCode
     ├── GitHub
     ├── Gmail
     ├── LinkedIn
     └── ChatGPT
```

---

# ✏️ Edit a Capsule

Each capsule provides additional actions.

Available operations include:

```text
Rename
Edit Websites
Add Current Tab
Remove Website
Duplicate
Open
Open in New Window
Export
Delete
```

---

# 🔀 Reorder Websites

Inside the capsule editor, websites can be reordered using drag and drop.

Example:

### Before

```text
GitHub
Google
ChatGPT
YouTube
```

### After

```text
ChatGPT
GitHub
YouTube
Google
```

The new order is preserved when the capsule is opened.

---

# ➕ Add Current Tab

To add the currently active website:

```text
Current Tab
    ↓
Select Capsule
    ↓
Add
```

If the website already exists, Black Hole warns about the duplicate.

---

# 🗑️ Delete a Capsule

Deleting a capsule requires confirmation.

```text
Delete "Project Development"?

This will remove the saved capsule and its websites.

[Cancel] [Delete]
```

Deleting a capsule **does not close any currently open Chrome tabs**.

It only removes the saved capsule.

---

# 📋 Duplicate a Capsule

A capsule can be duplicated.

Example:

```text
Project Development
        ↓
    Duplicate
        ↓
Project Development Copy
```

The original capsule remains unchanged.

---

# 📤 Export Capsules

Go to:

```text
Settings
    ↓
Export Capsules
```

Black Hole generates a JSON file containing the saved capsules.

This can be used as a backup.

---

# 📥 Import Capsules

Go to:

```text
Settings
    ↓
Import Capsules
```

Select a valid Black Hole JSON export.

The extension validates:

* JSON structure
* Version
* Capsule data
* Website data
* URLs
* Required fields

Invalid files are rejected safely.

---

# 🌙 Theme

Black Hole supports:

```text
System
Light
Dark
```

### System

Automatically follows your operating system.

### Light

Uses the light interface.

### Dark

Uses the dark interface.

---

# ⌨️ Keyboard Shortcut

Black Hole supports Chrome extension commands where supported by Chrome.

The shortcut can be configured from:

```text
chrome://extensions/shortcuts
```

Chrome controls the final shortcut assignment and availability.

---

# 🧪 Testing

Before considering the extension ready for production, test the following.

### Test 1 — Create Capsule

Open 3 websites and save them.

Expected:

```text
Capsule created
3 websites saved
```

### Test 2 — Open Capsule

Open the capsule.

Expected:

```text
3 websites reopen
```

### Test 3 — Save & Close

Expected:

```text
Tabs saved
      ↓
Tabs closed
```

### Test 4 — Delete Capsule

Expected:

```text
Capsule deleted
Existing browser tabs remain open
```

### Test 5 — Browser Restart

Restart Chrome.

Expected:

```text
Capsules remain available
```

### Test 6 — Multiple Capsules

Create 10 capsules.

Expected:

```text
All capsules displayed correctly
```

### Test 7 — Search

Search:

```text
project
```

Expected:

```text
Project Development
AI Project
College Project
```

### Test 8 — Duplicate URL

Attempt to add an existing website.

Expected:

```text
Duplicate website warning
```

### Test 9 — Invalid Import

Import malformed JSON.

Expected:

```text
Invalid capsule file
```

The extension should continue working.

### Test 10 — Valid Import

Import a valid backup.

Expected:

```text
Capsules restored
```

### Test 11 — Invalid Website

Open a capsule containing an invalid website.

Expected:

```text
Invalid website skipped
Other websites continue opening
```

### Test 12 — Themes

Test:

```text
System
Light
Dark
```

Expected:

```text
UI remains readable and correctly styled
```

---

# ⚠️ Chrome Limitations

Some browser pages cannot be treated like normal websites.

Examples include:

```text
chrome://
chrome-extension://
edge://
about:
```

Black Hole handles unsupported/internal pages safely rather than pretending they can always be restored.

Chrome also controls extension permissions and keyboard shortcut behavior.

---

# 🔐 Permissions

Black Hole uses only the permissions required for its functionality.

### `tabs`

Required to:

* Read the user's currently open tabs when explicitly saving
* Retrieve tab URLs and metadata
* Create tabs when restoring capsules
* Close tabs after a successful Save & Close

### `storage`

Required to:

* Store capsules
* Store settings
* Preserve data after Chrome restarts

### `commands`

Used for supported keyboard shortcuts.

No unnecessary remote permissions or backend access are required.

---

# 🏗️ Architecture

Black Hole separates the major responsibilities of the extension.

```text
                  ┌───────────────────┐
                  │   Popup UI        │
                  │ popup.js          │
                  └─────────┬─────────┘
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │ Storage   │  │ Tab       │  │ Helpers   │
       │ Layer     │  │ Manager   │  │           │
       └─────┬─────┘  └─────┬─────┘  └───────────┘
             │              │
             ↓              ↓
       chrome.storage    chrome.tabs
             │
             ↓
       Local Capsule Data
```

This separation makes it easier to add future functionality without rewriting the complete extension.

---

# 📊 Data Model

A capsule follows a structure similar to:

```javascript
{
    id: "unique-id",

    name: "Placement Preparation",

    description: "Websites used for placement preparation",

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
```

---

# 🛡️ Security Principles

Black Hole follows Chrome extension security best practices.

The project avoids:

```javascript
eval()
```

and unsafe dynamic script execution.

User-controlled values are handled using safe DOM APIs where possible.

The extension does not inject arbitrary remote JavaScript.

---

# 🌐 Offline First

The extension itself does not require an internet connection.

The extension operates locally using:

```text
Chrome Extension APIs
        +
chrome.storage.local
```

Internet access is only needed when the user chooses to open websites that themselves require an internet connection.

---

# 🚧 Future Improvements

The architecture allows future features such as:

* Chrome Storage Sync
* Cloud backup
* Cross-device synchronization
* Workspace sharing
* Capsule collaboration
* Automatic session detection
* Automatic capsule updates
* Capsule scheduling
* Workspace statistics
* Website categories
* Custom keyboard shortcuts
* Tab groups integration
* Chrome Web Store distribution
* Backup history
* Capsule locking
* Workspace notes
* Recently closed capsule recovery

---

# ☁️ Future Cloud Architecture

Cloud synchronization is intentionally **not required in Version 1**.

The current storage layer is isolated so future implementations could use:

```text
Black Hole
     │
     ├── Local Storage
     │
     └── Future Cloud Sync
             │
             ├── Authentication
             ├── Database
             └── Cross-device Sync
```

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork
```

### 2. Clone it

```bash
git clone https://github.com/YOUR-USERNAME/black-hole.git
```

### 3. Create a branch

```bash
git checkout -b feature/new-feature
```

### 4. Make your changes

Test the extension thoroughly in Chrome.

### 5. Commit

```bash
git add .
git commit -m "Add new feature"
```

### 6. Push

```bash
git push origin feature/new-feature
```

### 7. Create a Pull Request

Describe:

* What was changed
* Why it was changed
* How it was tested

---

# 📜 License

Choose a license appropriate for your project before publishing.

For example:

```text
MIT License
```

If using MIT, add a `LICENSE` file containing the official MIT License text.

---

# 👨‍💻 Author

**Harish**

Computer Science & Business Systems

---

# ⭐ Support the Project

If you find **Black Hole** useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report bugs
💡 Suggest features
🤝 Contribute improvements

---

# 🕳️ Black Hole

> **Your tabs disappear. Your workspace doesn't.**

**Save it. Close it. Come back later.**

---
