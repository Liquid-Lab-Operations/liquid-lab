# Obsidian: Engineering Deep Dive & Expert Guide
**Compiled by:** Liquid Lab Operations  
**Date:** 2026-06-07  
**Level:** Advanced Engineer / Architect  
**Purpose:** Reference guide for implementing Obsidian at enterprise scale with neurônios architecture

---

## Table of Contents
1. [Architecture & Fundamentals](#architecture--fundamentals)
2. [Vault Management & Data Storage](#vault-management--data-storage)
3. [Core Features Deep Dive](#core-features-deep-dive)
4. [Plugin Ecosystem & Extensibility](#plugin-ecosystem--extensibility)
5. [API & TypeScript Development](#api--typescript-development)
6. [Sync, Collaboration & Teams](#sync-collaboration--teams)
7. [Performance Optimization](#performance-optimization)
8. [Security & Privacy](#security--privacy)
9. [Advanced Workflows](#advanced-workflows)
10. [Enterprise Deployment](#enterprise-deployment)

---

## 1. Architecture & Fundamentals

### Core Philosophy
**"Writing is telepathy"** — Obsidian's fundamental principle is that notes are plain text markdown files stored locally on your device, allowing ideas to travel through time and space without intermediaries.

### Technology Stack
- **Runtime:** Electron (desktop), native iOS/Android (mobile)
- **Language:** TypeScript + React
- **Storage:** Plain text Markdown files (CommonMark, GFM, LaTeX)
- **Backend Cache:** IndexedDB (low-level client-side database)
- **Search:** Local full-text search with regex support
- **Sync:** Optional E2E encrypted sync service (AES-256)
- **Publishing:** Optional cloud publishing service

### Design Principles
1. **Local First** — Data lives on your device first; sync is optional
2. **Open Format** — Notes are plain `.md` files; you own your data
3. **Privacy by Default** — No cloud lock-in; offline-first architecture
4. **Extensibility** — TypeScript API for plugins; 4,490+ community plugins
5. **Markdown Native** — Markdown is the lingua franca; no proprietary formats

---

## 2. Vault Management & Data Storage

### Vault Structure
A vault is a folder on your local filesystem containing markdown notes and attachments.

```
my-vault/
├── .obsidian/              # Configuration folder (dot-prefixed, hidden)
│   ├── workspace.json      # Current workspace layout
│   ├── plugins.json        # Installed plugins metadata
│   ├── community-plugins/  # Community plugin files
│   ├── themes/             # Custom theme CSS files
│   ├── snippets/           # Custom CSS snippets (.css files)
│   ├── config/             # Core plugin configs (JSON)
│   ├── hotkeys.json        # Hotkey bindings
│   └── app.json            # Global app settings
├── 📁 Projects/
├── 📁 References/
├── 📁 Attachments/
├── note1.md
├── note2.md
└── nested/
    └── note3.md
```

### Critical Configuration Files

**`.obsidian/workspace.json`**
- Stores current workspace layout (pane structure, open files, sidebar state)
- Updates frequently; consider `.gitignore` if using version control
- Contains "workspaces" definition for multiple layout presets

**`.obsidian/plugins.json`**
```json
{
  "obsidian-git": {
    "id": "obsidian-git",
    "desc": "Backup your vault with git",
    "isDesktopOnly": true
  }
}
```

**`.obsidian/app.json`**
- Global Obsidian settings
- Default behavior, autocomplete, formatting preferences

### Data Storage Layer

#### Metadata Cache
Obsidian maintains an in-memory metadata cache for performance:
- **Backlinks** — All internal links to a note
- **Outgoing links** — Links from the current note
- **Tags** — Tags parsed from the note
- **Frontmatter** — YAML properties at the top of the file
- **Headings** — Hierarchical heading structure
- **Blocks** — Block references and block IDs

The cache is stored in **IndexedDB** for persistence across sessions.

#### Indexing Strategy
- Incremental indexing on file changes
- Full reindex on startup (can be triggered manually in Settings)
- Performance threshold: autocomplete switches to simpler algorithm at 10,000+ items

### Global Settings Storage
Location varies by OS:
- **macOS:** `~/Library/Application Support/obsidian/`
- **Windows:** `%APPDATA%\Obsidian\`
- **Linux:** `$XDG_CONFIG_HOME/obsidian/` or `~/.config/obsidian/`

> ⚠️ **Never create a vault in the system folder** — this can cause data loss or corruption.

### Multi-Vault Architecture
You can open multiple vaults as separate instances. Benefits:
- **Separation of concerns** — Work vs. personal vaults
- **Performance** — Smaller vaults = faster search/graph rendering
- **Collaboration** — Different teams on different vaults
- **Access control** — Granular permissions per vault

---

## 3. Core Features Deep Dive

### 3.1 Internal Links & Backlinks

**Link Syntax:**
```markdown
[[Note Name]]                    # Link to note
[[Note Name|Display Text]]       # Link with alias
[[Note Name#Heading]]            # Link to heading
[[Note Name#^block-id]]          # Block reference
[[Note Name|#Heading]]           # Link to heading with alt text
```

**Block References:**
```markdown
This is a paragraph with a block ID.
^important-block

Link to it elsewhere: [[Note#^important-block]]
```

**Bidirectional Linking Magic:**
- Links are tracked in both directions (Graph view shows this)
- **Backlinks** panel shows all notes linking to current note
- **Unlinked mentions** finds note references without explicit links
- Enables serendipitous discovery of related ideas

### 3.2 Graph View Architecture

**How It Works:**
1. **Nodes** represent files; size correlates to inbound link count
2. **Edges** represent links between files
3. **Directionality** shown with arrows (toggleable in settings)
4. **Local graph** shows only notes connected to current note
5. **Filtering** by tags, file type, link direction

**Graph Rendering:**
- Uses canvas-based visualization for performance
- Real-time updates as you create/modify links
- Customizable physics simulation (force-directed layout)

**Use Cases:**
- Visual knowledge mapping
- Finding isolated clusters of notes
- Understanding idea emergence and connections
- Topic cartography for complex domains

### 3.3 Canvas: Infinite Whiteboard

Canvas is a `.canvas` file (JSON-based) that creates an infinite 2D space for visual brainstorming.

```json
{
  "nodes": [
    {
      "id": "node1",
      "type": "file",
      "file": "Notes/Project.md",
      "x": 0,
      "y": 0
    },
    {
      "id": "node2",
      "type": "text",
      "text": "This is a text card",
      "x": 300,
      "y": 0
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "fromNode": "node1",
      "toNode": "node2",
      "label": "relates to"
    }
  ]
}
```

**Features:**
- Add markdown files, images, audio, PDFs, web pages as cards
- Connect with labeled directional edges
- Group related cards
- Color coding for organization
- Infinite panning/zooming
- Export as image or PDF

### 3.4 Properties & Structured Data

Obsidian has moved from pure markdown to **Properties** — YAML frontmatter with type support.

**Example:**
```yaml
---
author: "Alice"
status: "draft"
publish-date: 2026-06-15
tags: [knowledge, engineering]
priority: 1
---

# Note Content Here
```

**Property Types:**
- **Text** — Single-line strings
- **Number** — Integers and decimals
- **Checkbox** — Boolean true/false
- **Date** — ISO 8601 format
- **Date & Time** — With timestamp
- **Select** — Predefined options
- **Multi-select** — Multiple values from list
- **Link** — Reference to another note

**Search Syntax:**
```
[property] returns files with that property
property:"value" filters by exact value
property:>5 filters by comparison (>, <, >=, <=)
```

### 3.5 Obsidian Flavored Markdown

Extensions beyond CommonMark:

```markdown
[[Internal Links]]              # Link to notes
![[Embed.md]]                   # Embed entire note
![[Image.png|width:200]]        # Embedded image with resize
![[Note#^block-id]]             # Embed specific block

==Highlighted text==            # Highlight/marker
~~Strikethrough~~               # Strikethrough
^footnote-ref                   # Footnote reference
%%Comment%%                     # Comment (hidden)

> [!note]
> Callouts with obsidian syntax
```

**HTML Interaction:**
- Markdown inside HTML tags is NOT processed (performance optimization)
```markdown
<div>
**This will NOT be bold** — Markdown isn't parsed inside HTML
</div>
```

---

## 4. Plugin Ecosystem & Extensibility

### Community Plugin Architecture

**Scale:** 4,490+ plugins | 120M+ total downloads | 551 themes

**Distribution:** [community.obsidian.md](https://community.obsidian.md)

### Top Plugins by Category

**Knowledge Management:**
- **Dataview** — Query engine for structured data
- **Tasks** — Task tracking and management
- **Calendar** — Daily notes calendar view
- **Kanban** — Kanban board for visualization

**Automation & Productivity:**
- **Templater** — Advanced template engine with JavaScript
- **Obsidian Git** — Version control integration
- **Quick Switcher++** — Enhanced file navigation
- **Various Housekeeping** — Auto-formatting and cleanup

**Visualization:**
- **Outliner** — Advanced list/outline manipulation
- **Excalidraw** — Embedded drawing tool
- **Advanced Tables** — Enhanced table features
- **Database Plugins** — SQL-like interfaces

### Core Plugins (Built-in)
Obsidian ships with 40+ core plugins, toggleable in Settings:
- **File Explorer** — Folder tree navigation
- **Search** — Full-text search with operators
- **Graph View** — Visual relationship mapping
- **Backlinks** — Bidirectional link visualization
- **Outgoing Links** — Links from current note
- **Tags** — Tag organization and filtering
- **Outline** — Heading hierarchy
- **Word Count** — Document statistics
- **Canvas** — Visual whiteboard
- **Daily Notes** — Daily journaling
- **Templates** — Template insertion
- **Web Clipper** — Browser extension

### Plugin Types & APIs

**Content Plugins:**
- Markdown post-processors
- Codemirror extensions (editor enhancements)
- Custom views and view types

**UI Plugins:**
- Ribbon buttons
- Sidebar panels
- Modal dialogs
- Context menu items
- Command palette items

**Data Plugins:**
- Vault event handlers
- Metadata cache observers
- Custom indexing

**Workspace Plugins:**
- Custom leaf types
- Layout managers
- Workspace event listeners

---

## 5. API & TypeScript Development

### Plugin Development Setup

```bash
# Clone sample plugin
git clone https://github.com/obsidianmd/sample-plugin
cd sample-plugin

# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run esbuild

# Release
npm run release
```

### Core API Reference

**Plugin Lifecycle:**
```typescript
import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    // Runs when plugin loads
    console.log('Plugin loaded');
    
    this.addCommand({
      id: 'my-command',
      name: 'My Command',
      callback: () => {
        // Command logic
      }
    });
  }

  onunload() {
    // Cleanup when plugin unloads
    console.log('Plugin unloaded');
  }
}
```

**App & Workspace:**
```typescript
// Access app instance
this.app.vault              // Vault API (file operations)
this.app.workspace          // Workspace (view management)
this.app.metadataCache      // Metadata cache (backlinks, tags, etc)
this.app.commands           // Command registry
this.app.plugins            // Plugin manager
```

**Vault API - File Operations:**
```typescript
import { TFile, TFolder } from 'obsidian';

// Read file
const content = await this.app.vault.read(file);

// Write file
await this.app.vault.modify(file, newContent);

// Create file
const newFile = await this.app.vault.create(path, content);

// Delete file
await this.app.vault.delete(file);

// Get file by path
const file = this.app.vault.getAbstractFileByPath('path/to/file.md');

// List files
this.app.vault.getMarkdownFiles().forEach(file => {
  console.log(file.path);
});
```

**Event Handling:**
```typescript
// File events
this.registerEvent(
  this.app.vault.on('create', (file) => {
    console.log('File created:', file.path);
  })
);

this.registerEvent(
  this.app.vault.on('modify', (file) => {
    console.log('File modified:', file.path);
  })
);

this.registerEvent(
  this.app.vault.on('delete', (file) => {
    console.log('File deleted:', file.path);
  })
);

// Workspace events (layout changes)
this.registerEvent(
  this.app.workspace.on('file-open', (file) => {
    console.log('File opened:', file?.path);
  })
);

// Metadata cache updates
this.registerEvent(
  this.app.metadataCache.on('changed', (file) => {
    console.log('Metadata changed:', file.path);
  })
);
```

**Metadata Cache:**
```typescript
// Get file metadata
const metadata = this.app.metadataCache.getFileCache(file);

// Access components
console.log(metadata.frontmatter);        // Properties
console.log(metadata.headings);           // Headings
console.log(metadata.links);              // Outgoing links
console.log(metadata.listItems);          // List items
console.log(metadata.sections);           // Content sections

// Get backlinks (incoming links)
const backlinks = this.app.metadataCache.getBacklinksForFile(file);
```

**UI Components:**
```typescript
import { Modal, App } from 'obsidian';

class MyModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText('Hello, world!');
  }

  onClose() {
    const { contentEl } = contentEl.empty();
  }
}

// Show modal
new MyModal(this.app).open();
```

**Settings UI:**
```typescript
import { PluginSettingTab, Setting } from 'obsidian';

class MySettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('My Setting')
      .setDesc('Description here')
      .addText(text => text
        .setPlaceholder('Enter your setting')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
```

### Inter-Plugin Communication

**Expose API:**
```typescript
export default class MyPlugin extends Plugin {
  api = {
    myFunction: () => 'Hello from MyPlugin'
  };

  onload() {
    // Make API accessible to other plugins
    (this.app.plugins.plugins as any)['my-plugin-id']?.api;
  }
}
```

**Access Other Plugin's API:**
```typescript
const otherPlugin = this.app.plugins.plugins['other-plugin-id'];
const result = otherPlugin?.api?.someFunction?.();
```

### Best Practices

1. **Register event listeners** using `registerEvent()` — auto cleanup
2. **Register DOM handlers** using `registerDomEvent()`
3. **Register DOM event listeners** using `registerScopeEvent()`
4. **Unload cleanup** — always clean up in `onunload()`
5. **Error handling** — wrap async operations in try/catch
6. **Performance** — avoid blocking operations; use `requestIdleCallback()`

---

## 6. Sync, Collaboration & Teams

### Obsidian Sync Architecture

**Protocol:** E2E encrypted sync using AES-256

**Encryption Flow:**
1. User creates sync password (separate from account password)
2. Password derives encryption key
3. Each file encrypted before upload
4. Server never has access to plaintext
5. Sync verified at client-side

**Key Features:**
- **Selective Sync** — Choose which file types to sync (images, audio, video, PDFs)
- **Version History** — Restore files to any point in history (1 year retention)
- **Conflict Resolution** — Uses Google's diff-match-patch algorithm for markdown files
- **Offline Support** — Works fully offline; syncs when back online

**Limitations:**
- File size limits: 5MB (Standard) / 200MB (Plus)
- Sync only when app is running
- Higher conflict rates with longer offline periods or concurrent edits

### Team Collaboration

**Shared Vaults:**
```
Invite → Email invitation → Accept → Shared vault access
```

**Access Control:**
- Owner (full permissions)
- Can edit (read/write)
- Can view (read-only) — planned feature

**Workflow:**
- Real-time sync of changes
- Each user sees other users' edits immediately
- Conflict resolution automatic for most cases
- Works for both individual and team vaults

### Git Integration (Community Plugin)

For async collaboration and version control:

```bash
# Using obsidian-git plugin
# Automatic commit-and-sync workflow:
1. Stage changes
2. Commit with message
3. Pull from remote
4. Push to remote
```

**Advantages over Sync:**
- Full commit history
- Branching support
- Async collaboration (no live conflict issues)
- Self-hosted option

**Disadvantages:**
- Not real-time
- Requires Git knowledge
- Merge conflicts possible

### Mobile Sync

**iOS/iPadOS:**
- Obsidian Sync
- iCloud Drive
- Dropbox
- OneDrive

**Android:**
- Obsidian Sync
- Dropbox
- OneDrive
- Syncthing (via 3rd party)

**Limitations:**
- Sync only when app running
- Mobile-specific UI differences
- Plugin availability varies

---

## 7. Performance Optimization

### Vault Size Management

**Thresholds:**
- 10,000 items: Autocomplete switches to simpler algorithm
- 50,000+ items: Graph view may lag
- 100,000+ items: Search performance degrades

**Optimization Strategies:**

1. **Multi-Vault Architecture**
```
Split large vault into smaller ones:
- main-vault (10,000 notes)
- archive-vault (old notes)
- work-vault (current projects)
- reference-vault (external content)
```

2. **Exclude Files from Indexing**
```json
// In .obsidian/app.json
{
  "filesToIgnore": [
    "**/tmp/**",
    "**/archive/**",
    "*.tmp.md"
  ]
}
```

3. **Lazy Loading**
- Don't open all files at startup
- Use quick switcher for navigation
- Link to files rather than embedding all content

4. **Cache Management**
- Rebuild metadata cache if it becomes out of sync
- Settings → Files and links → Rebuild cache
- Can also be done programmatically via API

### Query Performance

**Search Optimization:**
```markdown
# Fast queries
tag:#project           # Tag search is indexed
file:name             # Filename search is fast
path:folder/          # Path filtering

# Slower queries
content:text          # Full-text search (slower)
regex:/pattern/       # Regex search (slowest)

# Combine for speed
tag:#todo file:inbox content:urgent  # Indexed first, then refined
```

**Dataview Query Optimization:**
```javascript
// Slow: complex calculations
LIST
WHERE contains(string(file.ctime), "2024")

// Fast: use properties
LIST
WHERE date >= 2024-01-01 AND date <= 2024-12-31
```

### Memory Management

**Monitor with:**
- Developer tools (Ctrl+Shift+I)
- Chrome DevTools (if using Electron)
- Task Manager memory usage

**Optimization:**
1. Disable unused core plugins
2. Unload unused community plugins
3. Limit open tabs/panes
4. Close large canvas files when not in use

---

## 8. Security & Privacy

### Data Ownership
- **Local First** — Your data stays on your device by default
- **No Cloud Lock-in** — Export any time; notes are plain Markdown
- **No Tracking** — No analytics, no ads, no data collection
- **No Vendor Lock-in** — Obsidian can read your vault; you can read it with any Markdown editor

### Encryption at Rest
- **Sync:** Files encrypted with AES-256 before leaving device
- **Local:** No encryption by default (depends on OS-level encryption)
- **Recommendation:** Use full-disk encryption (BitLocker, FileVault)

### Encryption in Transit
- Sync uses HTTPS with end-to-end encryption
- Verification tokens ensure encryption wasn't bypassed
- No server-side access to plaintext

### Sync Security Considerations

**Threat Model:**
- ✅ Obsidian cannot read your notes
- ✅ Attacker with server access cannot read notes
- ❌ Attacker with device access can read notes (local file access)

**Best Practices:**
1. Use unique sync password (different from account password)
2. Don't share sync password
3. Use device-level security (biometric, PIN)
4. Enable two-factor authentication on Obsidian account
5. Rotate encryption password periodically for old syncs

### Privacy Regulations

Obsidian complies with:
- **GDPR** — User data is yours; Obsidian doesn't process it
- **HIPAA** — Can be configured for healthcare use (with care)
- **SOC 2** — Sync service undergoes security audits

---

## 9. Advanced Workflows

### 9.1 Obsidian URI for Automation

**URI Protocol** enables cross-app automation:

```bash
# Open vault
obsidian://open?vault=my%20vault

# Open specific note
obsidian://open?vault=my%20vault&file=notes/project

# Navigate to heading
obsidian://open?vault=my%20vault&file=notes&heading=Architecture

# Create new note with content
obsidian://new?vault=my%20vault&name=daily%20note&content=Daily%20standup%0A-%20Task%201

# Search
obsidian://search?vault=my%20vault&query=project

# Daily note
obsidian://daily?vault=my%20vault

# Callback URLs (x-callback-url)
obsidian://new?vault=my%20vault&content=Test&x-success=myapp://callback?name={name}&url={url}
```

**Encoding Requirements:**
- Spaces: `%20`
- Forward slash: `%2F`
- Hash: `%23`
- Caret: `%5E`

**Use Cases:**
- Automation from Alfred/Raycast/Spotlight
- Shortcuts (iOS) integration
- Zapier/IFTTT workflows
- Custom CLI tools

### 9.2 Web Clipper Workflow

**Capture Pipeline:**
1. Highlight important text on webpage
2. Use browser extension (hotkey or right-click)
3. Choose template
4. Content extracted and formatted
5. Saved to vault with metadata

**Template Variables:**
```markdown
---
source: {{hostname}}
saved: {{date}}
author: {{author}}
tags: [web-clip]
---

# {{title}}

{{content}}

[Original]({{url}})
```

**Template Filters:**
```
{{text|truncate:50}}   # Truncate to 50 chars
{{text|replace:foo:bar}}
{{text|uppercase}}
{{text|lowercase}}
```

### 9.3 Templater Plugin for Automation

**Advanced JavaScript-based templating:**

```javascript
---
created: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.file.title %>

## Context
<% await tp.system.prompt("What's this about?") %>

## Metadata
- Created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
- File Path: <% tp.file.path %>
- Vault: <% tp.vault.getName() %>

## Links
<% tp.date.yesterday("YYYY-MM-DD", -1) %>
<% tp.date.tomorrow("YYYY-MM-DD", 1) %>

## Execution
<% tp.file.move(`${tp.date.now("YYYY/MM")}/${tp.file.title}`) %>
```

### 9.4 Dataview for Knowledge Queries

**SQL-like queries over your vault:**

```javascript
// List all projects with deadlines
LIST
FROM #project
WHERE date(deadline) > today
SORT deadline ASC
```

```javascript
// Table view with properties
TABLE
  status, priority, created
FROM #task
WHERE status = "pending"
GROUP BY priority
```

```javascript
// Complex aggregations
LIST
  (rows.status.distinct) as status,
  (length(rows)) as count
FROM #project
GROUP BY status
```

---

## 10. Enterprise Deployment

### Obsidian for Teams

**Licensing:**
- Individual: Free or Catalyst license
- Commercial: License required (no functional differences)
- Organization: 25+ licenses get featured on Enterprise page

**Enterprise Features Planned:**
- Domain authentication (SSO)
- Role-based access control
- Audit logging
- Compliance certifications

### Deployment Architecture

**Recommended Setup:**

```
┌─────────────────────────────────────────────────┐
│         Obsidian Sync (E2E Encrypted)           │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  Git Repository (Version Control + Backup)      │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  GitHub/GitLab (Team Collaboration)             │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  Obsidian Publish (Public Knowledge Base)       │
└─────────────────────────────────────────────────┘
```

### Knowledge Management at Scale

**Neurônio Architecture (Liquid Lab Standard):**

```
brain/
├── CTX/               # Context neuros (company, decisions)
│   ├── CTX-001.md    # Company vision
│   ├── CTX-002.md    # Decision framework
│   └── CTX-003.md    # Culture & values
├── PRJ/               # Project neuros (active initiatives)
│   ├── PRJ-001.md    # Project A
│   ├── PRJ-002.md    # Project B
│   └── PRJ-003.md    # Project C
├── DEC/               # Decision neuros (architecture)
│   ├── DEC-001.md    # Tech stack rationale
│   ├── DEC-002.md    # Deployment strategy
│   └── DEC-003.md    # API design
├── SYS/               # System neuros (configurations)
│   ├── SYS-001.md    # Deployment pipeline
│   ├── SYS-002.md    # Monitoring setup
│   └── SYS-003.md    # Database schema
└── Index.md           # Knowledge base index
```

**Cross-Linking Pattern:**
```markdown
# Project A (PRJ-001)

Related context: [[CTX-001]]
Architectural decisions: [[DEC-001]], [[DEC-002]]
System config: [[SYS-001]]
```

**Git Integration:**
```bash
# Automatic syncing with auto-save
git config user.email "operations@liquidlab.ag"
git config user.name "Liquid Lab Operations"

# Daily backups
0 2 * * * cd /path/to/brain && git add -A && git commit -m "auto-backup $(date)" && git push
```

### Team Workflows

**Async Collaboration:**
1. Edit in local vault
2. Commit to Git
3. Push to GitHub
4. Team reviews via GitHub PR
5. Merge to main
6. All vaults auto-update

**Real-time Collaboration:**
1. Share vault via Obsidian Sync
2. Multiple users editing simultaneously
3. Automatic conflict resolution
4. Changes sync in real-time

**Publishing Workflow:**
1. Write in Obsidian vault
2. Tag with `#public`
3. Publish via Obsidian Publish
4. Site updates automatically
5. SEO metadata auto-optimized

---

## Advanced Topics

### Customization & Theming

**CSS Variables (400+ available):**
```css
:root {
  --color-accent: #5e42eb;          /* Liquid Purple */
  --color-base: #041e32;             /* Ocean Blue */
  --text-normal: #333;
  --text-faint: #999;
}

.theme-dark {
  --color-accent: #7c5cff;
  --color-base: #1a2332;
}
```

**CSS Snippets:**
```css
/* Custom note styling */
.markdown-preview-view h1 {
  border-bottom: 3px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

/* Custom theme for tags */
.tag {
  background: var(--color-accent);
  padding: 2px 6px;
  border-radius: 3px;
  color: white;
}
```

### Performance Monitoring

**Metrics to track:**
- Note count growth
- Vault size over time
- Sync latency
- Search performance
- Plugin load times

**Tools:**
- Obsidian Status bar
- Developer console
- Chrome DevTools (Electron)
- Plugins: Statistics, Advanced Statistics

### Disaster Recovery

**Backup Strategy:**
1. Obsidian Sync (automatic)
2. Git (version control)
3. Cloud storage (Dropbox, iCloud, OneDrive)
4. Local external drive

**Recovery:**
```bash
# Restore from Git
git log --oneline              # See history
git checkout <commit> <file>   # Restore specific file

# Restore from Sync
obsidian://open?vault=...      # Open from cloud
```

---

## Resources & References

### Official Documentation
- **Help Site:** [help.obsidian.md](https://help.obsidian.md)
- **Developer Docs:** [docs.obsidian.md](https://docs.obsidian.md)
- **Community:** [community.obsidian.md](https://community.obsidian.md)
- **Forum:** [forum.obsidian.md](https://forum.obsidian.md)
- **Discord:** [discord.gg/obsidianmd](https://discord.gg/obsidianmd)

### Community Resources
- **Obsidian Hub:** [publish.obsidian.md/hub](https://publish.obsidian.md/hub)
- **Plugin Browser:** [4,490+ plugins](https://community.obsidian.md/plugins)
- **Theme Gallery:** [551+ themes](https://community.obsidian.md/themes)

### Learning Paths
1. **Beginner:** Create vault → Write notes → Create links → Graph view
2. **Intermediate:** Properties → Templates → Plugins → Custom CSS
3. **Advanced:** Plugin development → API → Multi-vault architecture
4. **Expert:** Enterprise deployment → Team workflows → Knowledge management systems

---

## Conclusion

Obsidian is a powerful knowledge management system with three key strengths:

1. **Data Ownership** — Your notes, your device, your rules
2. **Extensibility** — 4,490+ plugins, open API, community-driven
3. **Simplicity** — Markdown-based, zero vendor lock-in, offline-first

When deployed at enterprise scale with proper architecture (neurônios, Git, Sync), Obsidian can serve as the central nervous system for organizational knowledge.

**Next steps for Liquid Lab:**
- [ ] Initialize Docker Compose local stack
- [ ] Configure Obsidian Sync encryption
- [ ] Setup Git integration for brain/ vault
- [ ] Create CTX/PRJ/DEC/SYS neuronios
- [ ] Deploy Obsidian Publish for public documentation
- [ ] Setup GitHub Actions for automated backups
- [ ] Document team workflows and best practices

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-07  
**Maintained By:** Liquid Lab Operations  
**License:** Internal Reference Document
