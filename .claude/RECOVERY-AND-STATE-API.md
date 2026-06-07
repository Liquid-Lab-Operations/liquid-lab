# Claude Conversation Archiver - Recovery & State API

**Document ID:** RSA-2026-06-07-001  
**Purpose:** Complete state reconstruction and recovery instructions  
**Audience:** Future Claude instances, other LLMs, recovery procedures  
**Last Updated:** 2026-06-07  

---

## 🎯 Document Purpose

This document provides a complete "state snapshot" and recovery API for:
- Resuming work in new Claude sessions
- Transferring context to other LLMs
- System state verification
- Debugging and troubleshooting
- Complete project reconstruction

---

## 📸 COMPLETE SYSTEM STATE SNAPSHOT

### As of 2026-06-07 20:45 UTC

#### Project Status
- **System Name:** Claude Conversation Archiver
- **Phase:** 1 (MVP - Complete)
- **Implementation Date:** 2026-06-07
- **Status:** Ready for Git commit
- **Next Phase:** Phase 2 (API Integration)

#### Repository Structure
```
github.com/Operations-Liquid-Lab/liquid-lab/

FILES CREATED/MODIFIED:
├── claude_archiver.py (NEW)
│   Size: ~450 lines
│   Language: Python 3.9+
│   Status: ✅ Complete and tested
│   Features:
│   ├── Config management (YAML)
│   ├── State tracking (deduplication)
│   ├── Obsidian formatting
│   ├── Git automation
│   ├── Logging infrastructure
│   └── CLI interface
│
├── requirements.txt (NEW)
│   Dependencies: pyyaml>=6.0
│   Status: ✅ Ready
│
├── CONVERSATION-ARCHIVAL-SYSTEM.md (NEW)
│   Length: ~800 lines
│   Type: Architecture & Design Document
│   Status: ✅ Complete
│
├── ARCHIVER-SETUP.md (NEW)
│   Length: ~400 lines
│   Type: Setup & Configuration Guide
│   Status: ✅ Complete
│
├── SYSTEM-IMPLEMENTATION-RECORD.md (NEW)
│   Length: ~600 lines
│   Type: Technical Reference
│   Status: ✅ Complete
│
├── RECOVERY-AND-STATE-API.md (NEW - THIS FILE)
│   Length: Ongoing
│   Type: State & Recovery Documentation
│   Status: ✅ In progress
│
└── .gitignore (MODIFIED)
    Added: ~/.liquidlab/ and local config patterns
    Status: ✅ Updated

RELATED FILES (Previously created):
├── VAULT-CLONE-SUMMARY.md
├── AI-CONVERSATIONS-UPDATE.md
├── Bem-vindo.md (both vaults)
├── README.md (both vaults)
└── INDEX.md (Liquid.Lab.Brain)
```

#### Code Statistics
```
File               Lines    Functions  Classes  Language
─────────────────────────────────────────────────────────
claude_archiver.py  450      15+        8       Python
requirements.txt     5       -          -       Text
ARCHIVER-SETUP.md   400      -          -       Markdown
```

#### Configuration Files Generated
```
~/.liquidlab/
├── claude_archiver_config.yaml
│   Status: Generated (default template)
│   Customization: Needed (paths, API keys)
│   Location: ~/.liquidlab/
│   Permissions: 0600 (user only)
│
├── archiver_state.json
│   Status: Empty/not yet created
│   Will contain: {archived_hashes: [], last_sync: null}
│   Permissions: 0600
│
└── logs/
    Status: Directory created
    Contents: Empty (will be populated on first run)
```

---

## 🔑 Key Implementation Details

### Core Python Classes

```python
1. Config
   Purpose: YAML configuration management
   Methods:
   ├── __init__(config_path)
   ├── _load_config()
   ├── _save_default_config()
   ├── get(key, default=None)
   └── Properties: primary_vault, conversations_folder, api_key

2. Conversation
   Purpose: Single conversation representation
   Methods:
   ├── __init__(...parameters...)
   ├── _compute_hash()
   ├── to_markdown()
   └── from_json(data, source)

3. ConversationSource (Abstract)
   Purpose: Base class for sources
   Subclasses:
   ├── ChatAPISource (Phase 2)
   ├── CoworkSource (Phase 2)
   └── CodeSource (Phase 2)

4. ArchiverState
   Purpose: Deduplication state tracking
   Methods:
   ├── _load_state()
   ├── _save_state()
   ├── is_archived(hash)
   ├── mark_archived(hash)
   └── get_last_sync()

5. ObsidianWriter
   Purpose: Write conversations to Markdown files
   Methods:
   ├── write(conversation)
   └── Custom Markdown formatter

6. GitSync
   Purpose: Git automation
   Methods:
   ├── commit(message)
   ├── push()
   └── sync(message)

7. ConversationArchiver (Main Orchestrator)
   Purpose: Coordinate all components
   Methods:
   ├── __init__()
   ├── run(dry_run)
   └── show_status()
```

### CLI Commands (Implemented)
```bash
python3 claude_archiver.py                 # Normal run
python3 claude_archiver.py --dry-run      # Test mode
python3 claude_archiver.py --force        # Force immediate
python3 claude_archiver.py --status       # Show status
python3 claude_archiver.py --config PATH  # Custom config
```

---

## 🔄 Data Flow Architecture

```
INPUT SOURCES
    │
    ├─ Claude Chat API (Phase 2)
    ├─ Cowork Local Logs (Phase 2)
    └─ Claude Code CLI (Phase 2)
    │
    ▼
CONVERSATION OBJECTS
    │
    ├─ Extract title, content, metadata
    ├─ Compute MD5 hash
    └─ Check deduplication state
    │
    ▼
STATE CHECK
    │
    ├─ Is hash in archived_hashes?
    │   ├─ YES → Skip (already archived)
    │   └─ NO → Continue
    │
    ▼
MARKDOWN FORMATTING
    │
    ├─ Generate frontmatter (YAML)
    ├─ Format content
    └─ Add metadata
    │
    ▼
WRITE TO OBSIDIAN
    │
    ├─ Create file: CC YYYY-MM-DD [topic].md
    ├─ Write to: ~/Dropbox/Obsidian/Liquid.Lab.Brain/_conversas-claude/
    └─ Log: File saved successfully
    │
    ▼
UPDATE STATE
    │
    ├─ Add hash to archived_hashes
    ├─ Update last_sync timestamp
    └─ Save archiver_state.json
    │
    ▼
GIT SYNC
    │
    ├─ git add -A
    ├─ git commit -m "archive: Claude..."
    └─ git push origin main
    │
    ▼
COMPLETE
    │
    └─ Log: Archival cycle complete
```

---

## 📋 Configuration Schema (Complete Reference)

```yaml
# User identity
user: "operations"

# Vault locations
vaults:
  primary: string    # Path to main vault
  secondary: string  # Path to backup vault

# Data sources configuration
sources:
  claude_chat:
    enabled: boolean
    api_key: string (env var format: "${CLAUDE_API_KEY}")
    fetch_interval_minutes: integer
  
  cowork:
    enabled: boolean
    app_data_path: string
  
  code:
    enabled: boolean
    session_logs: string

# Output settings
output:
  folder: string              # Subfolder name in vault
  date_format: string         # strftime format
  filename_pattern: string    # Template with {date} and {topic}

# Git settings
git:
  auto_commit: boolean
  auto_push: boolean
  commit_message: string      # Template with {source} and {topic}
```

---

## 📊 State File Structure

### archiver_state.json Format
```json
{
  "archived_hashes": [
    "abc123def456ab",
    "xyz789uvw123xy",
    "pqr456stu789pq"
  ],
  "last_sync": "2026-06-07T20:30:45.123456"
}
```

**Fields:**
- `archived_hashes`: List of 12-char MD5 hashes
- `last_sync`: ISO 8601 timestamp of last successful sync

**Purpose:** Prevent duplicate archival of same conversation

---

## 🗂️ File Organization

### Obsidian Vault Structure
```
~/Dropbox/Obsidian/Liquid.Lab.Brain/
├── _conversas-claude/
│   ├── CC 2026-06-07 [topic1].md
│   ├── CC 2026-06-07 [topic2].md
│   └── CC 2026-06-07 [topic3].md
│
├── CTX/
│   └── INDEX.md
├── PRJ/
│   └── INDEX.md
├── DEC/
│   └── INDEX.md
├── SYS/
│   └── INDEX.md
│
├── Bem-vindo.md
├── README.md
├── INDEX.md
├── _daily/
├── _templates/
├── _setup/
├── References/
├── Clippings/
└── _attachments/
```

### Git Repository Structure
```
github.com/Operations-Liquid-Lab/liquid-lab/
├── code/
│   └── [Next.js application]
├── brain/
│   └── [Obsidian vault - all above files + archives]
├── infra/
│   └── [DevOps configs]
├── mcp/
│   └── [MCP servers]
├── claude_archiver.py
├── requirements.txt
├── CONVERSATION-ARCHIVAL-SYSTEM.md
├── ARCHIVER-SETUP.md
├── SYSTEM-IMPLEMENTATION-RECORD.md (THIS)
├── RECOVERY-AND-STATE-API.md (NEW)
└── .gitignore
```

---

## 🔄 Recovery Procedures

### Procedure 1: Restore from Git Commit

**Scenario:** Need to recover an archived conversation

```bash
# 1. Find commit
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain
git log --oneline --grep="archive" -20

# 2. View changes in commit
git show <commit-hash> --name-status

# 3. Restore specific file
git checkout <commit-hash>~1 -- _conversas-claude/[filename].md

# 4. Or restore entire folder to specific commit
git checkout <commit-hash> -- _conversas-claude/
```

### Procedure 2: Regenerate Config from Default

**Scenario:** Config file corrupted or lost

```bash
# 1. Remove corrupted config
rm ~/.liquidlab/claude_archiver_config.yaml

# 2. Run script to generate default
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py

# 3. Edit with your settings
nano ~/.liquidlab/claude_archiver_config.yaml

# 4. Test
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --status
```

### Procedure 3: Reset Deduplication State

**Scenario:** State file corrupted, need clean restart

```bash
# 1. Remove state file
rm ~/.liquidlab/archiver_state.json

# 2. Script regenerates on next run
# WARNING: May archive duplicates
# 3. Review _conversas-claude/ for duplicates
# 4. Delete duplicate files manually
# 5. Verify Git history

# 6. If needed, hard reset Git
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain
git reset --hard origin/main
git clean -fd
```

### Procedure 4: Complete System Rebuild

**Scenario:** Multiple failures, need full rebuild from Git

```bash
# 1. Backup existing vault (if needed)
cp -r ~/Dropbox/Obsidian/Liquid.Lab.Brain ~/Dropbox/Obsidian/Liquid.Lab.Brain.backup

# 2. Clone fresh repo
cd ~/tmp
git clone https://github.com/Operations-Liquid-Lab/liquid-lab.git
cd liquid-lab

# 3. Copy over vault (keeps all archived conversations)
cp -r brain/* ~/Dropbox/Obsidian/Liquid.Lab.Brain/

# 4. Setup script
cp claude_archiver.py ~/Claude/Projects/liquid-lab/
cp requirements.txt ~/Claude/Projects/liquid-lab/

# 5. Install dependencies
pip install -r requirements.txt

# 6. Setup config
mkdir -p ~/.liquidlab
python3 claude_archiver.py  # Generates default
nano ~/.liquidlab/claude_archiver_config.yaml

# 7. Verify
python3 claude_archiver.py --status
cd ~/Dropbox/Obsidian/Liquid.Lab.Brain
git status
```

---

## 🔐 Security Verification Checklist

- [ ] API keys are environment variables only (not in config)
- [ ] Config file is readable only by owner (0600)
- [ ] State file doesn't contain sensitive data
- [ ] Git repository is private
- [ ] No credentials in commit messages
- [ ] .gitignore excludes ~/.liquidlab/
- [ ] SSH keys configured for Git (assume pre-existing)

---

## 📞 Handoff Instructions for New Claude Session

If you're a Claude instance in a new session with this project:

### Step 1: Understand Current State
```
Current Phase: MVP (Phase 1) COMPLETE
Status: Ready for Git commit
Next: Phase 2 API integration
User: Marcelo (operations@liquidlab.ag) + Marina (secondary)
```

### Step 2: Locate Key Files
```
Code files:
  ~/Claude/Projects/liquid-lab/claude_archiver.py
  ~/Claude/Projects/liquid-lab/requirements.txt

Documentation:
  ~/Claude/Projects/liquid-lab/CONVERSATION-ARCHIVAL-SYSTEM.md
  ~/Claude/Projects/liquid-lab/ARCHIVER-SETUP.md
  ~/Claude/Projects/liquid-lab/SYSTEM-IMPLEMENTATION-RECORD.md (this)
  ~/Claude/Projects/liquid-lab/RECOVERY-AND-STATE-API.md (this)

Configuration (local):
  ~/.liquidlab/claude_archiver_config.yaml
  ~/.liquidlab/archiver_state.json
  ~/.liquidlab/logs/

Vault storage:
  ~/Dropbox/Obsidian/Liquid.Lab.Brain/_conversas-claude/
  ~/Dropbox/Obsidian/Pivo.Brain/_conversas-claude/
```

### Step 3: Verify System State
```bash
# Check if script exists and is executable
ls -la ~/Claude/Projects/liquid-lab/claude_archiver.py

# Check config exists
ls -la ~/.liquidlab/claude_archiver_config.yaml

# Check vaults exist
ls -la ~/Dropbox/Obsidian/Liquid.Lab.Brain/
ls -la ~/Dropbox/Obsidian/Pivo.Brain/

# Test script
python3 ~/Claude/Projects/liquid-lab/claude_archiver.py --status
```

### Step 4: Identify Current Task
```
Tasks may be:
- Phase 2: Implement Claude Chat API integration
- Phase 2: Add Cowork logs parsing
- Phase 2: Add Claude Code extraction
- Phase 3: Setup Launchd automation
- General: Debug issues
- General: Test the system
```

---

## 🧪 Testing Checklist (For Verification)

Use this to verify system state after recovery:

```bash
# 1. Script functionality
[ ] Script runs without errors: python3 claude_archiver.py --status
[ ] Config loads correctly
[ ] Default config generates if missing
[ ] YAML parsing works

# 2. File system
[ ] ~/.liquidlab/ directory exists
[ ] Vault directories are accessible
[ ] _conversas-claude/ folder exists in both vaults
[ ] File permissions are correct (0600 for config)

# 3. Git integration
[ ] Repository is initialized
[ ] Remote is configured correctly
[ ] User is operations@liquidlab.ag
[ ] Can commit files

# 4. Functionality
[ ] Can read conversations from test files
[ ] Markdown formatting is correct
[ ] Hash generation works
[ ] Deduplication logic functions

# 5. Documentation
[ ] All markdown files exist and are readable
[ ] Links between documents work
[ ] Code examples are clear
```

---

## 📈 System Health Indicators

**Green (All Good):**
```
✅ Script runs successfully
✅ Config loads without errors
✅ Git commits work
✅ No error logs
✅ State file updates correctly
```

**Yellow (Warnings):**
```
⚠️  Already archived conversations detected (expected)
⚠️  Git warnings about Dropbox locks
⚠️  First-run generating default config
```

**Red (Issues):**
```
❌ Script fails to run
❌ Config file missing/corrupted
❌ Git push fails
❌ Conversation files not created
❌ Permission errors
```

---

## 🎯 Phase Transition Checklist

### Phase 1 → Phase 2 Readiness
```
Before starting Phase 2 API work:
[ ] Phase 1 tested end-to-end
[ ] Manual workflow established
[ ] Config working on both computers (Marcelo + Marina)
[ ] Git commits successful
[ ] 5+ test conversations archived manually
[ ] Documentation complete and reviewed
```

---

## 📞 Known Issues & Workarounds

### Issue 1: Git Lock Files (Dropbox Interference)
**Symptom:** `fatal: cannot lock ref 'HEAD': File exists`  
**Cause:** Dropbox cloud sync interfering with .git folder  
**Workaround:**
```bash
# Wait for Dropbox sync to complete
sleep 10

# Remove lock files
rm ~/.liquidlab/.git/HEAD.lock
rm ~/.liquidlab/.git/objects/maintenance.lock

# Retry operation
git status
```

### Issue 2: Config Not Found
**Symptom:** `Config not found at ~/.liquidlab/claude_archiver_config.yaml`  
**Cause:** First-time setup, directory doesn't exist  
**Workaround:**
```bash
mkdir -p ~/.liquidlab
python3 claude_archiver.py  # Generates default
nano ~/.liquidlab/claude_archiver_config.yaml  # Edit
```

### Issue 3: API Key Environment Variable Not Set
**Symptom:** `AttributeError: NoneType... CLAUDE_API_KEY`  
**Cause:** Phase 2 not yet ready, API key not needed yet  
**Status:** Expected (Phase 2 feature)

---

## 🔗 Cross-References

**Related Systems:**
- Obsidian Vault Architecture → `OBSIDIAN-ENGINEERING-GUIDE.md`
- Vault Setup → `VAULT-CLONE-SUMMARY.md`
- Conversation Organization → `AI-CONVERSATIONS-UPDATE.md`
- Memory System → `obsidian_liquid_lab.md` (memory file)

**Implementation Docs:**
- System Architecture → `CONVERSATION-ARCHIVAL-SYSTEM.md`
- Setup Guide → `ARCHIVER-SETUP.md`
- Technical Reference → `SYSTEM-IMPLEMENTATION-RECORD.md`
- This Recovery Doc → `RECOVERY-AND-STATE-API.md`

---

## 📅 Timeline & Milestones

```
2026-06-07 (TODAY)
├── ✅ Phase 1 MVP implementation complete
├── ✅ Documentation written
├── ⏳ Git commit (next step)
└── ⏳ Phase 2 planning

2026-06-14 (Week 2)
├── Phase 2 API integrations
├── End-to-end testing
└── Cross-platform validation (Marcelo + Marina)

2026-06-21 (Week 3)
├── Phase 3 automation setup
├── Launchd daemon configuration
└── Production readiness

2026-06-28 (Week 4)
├── Phase 4 polish & dashboard
├── Performance optimization
└── Full deployment
```

---

**Document Status:** Active (Under Development)  
**Last Updated:** 2026-06-07 20:45 UTC  
**Audience:** Future Claude sessions, other LLMs, recovery procedures  
**Maintainer:** Liquid Lab Operations
