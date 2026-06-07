#!/usr/bin/env python3
"""
Claude Conversation Archiver
Captura conversas Claude (Chat, Cowork, Code) e salva em Obsidian com Git sync

Uso:
    python claude_archiver.py                    # Run normal archival cycle
    python claude_archiver.py --dry-run         # Test without saving
    python claude_archiver.py --force           # Force immediate archival
    python claude_archiver.py --status          # Show status
"""

import os
import sys
import json
import yaml
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import hashlib
import argparse

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG_PATH = Path.home() / ".liquidlab" / "claude_archiver_config.yaml"
LOG_DIR = Path.home() / ".liquidlab" / "logs"
STATE_FILE = Path.home() / ".liquidlab" / "archiver_state.json"

# Create directories if not exist
LOG_DIR.mkdir(parents=True, exist_ok=True)
CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / "claude_archiver.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# ============================================================================
# DEFAULT CONFIG
# ============================================================================

DEFAULT_CONFIG = {
    "user": "operations",
    "vaults": {
        "primary": str(Path.home() / "Library/CloudStorage/Dropbox/Obsidian/Liquid.Lab.Brain"),
        "secondary": str(Path.home() / "Library/CloudStorage/Dropbox/Obsidian/Pivo.Brain")
    },
    "sources": {
        "claude_chat": {
            "enabled": True,
            "api_key": "${CLAUDE_API_KEY}",
            "fetch_interval_minutes": 30
        },
        "cowork": {
            "enabled": False,  # TODO: Implement in Phase 2
            "app_data_path": str(Path.home() / "Library/Application Support/Claude")
        },
        "code": {
            "enabled": False,  # TODO: Implement in Phase 2
            "session_logs": str(Path.home() / ".claude-code/logs")
        }
    },
    "output": {
        "folder": "_conversas-claude",
        "date_format": "%Y-%m-%d",
        "filename_pattern": "CC {date} {topic}.md"
    },
    "git": {
        "auto_commit": True,
        "auto_push": True,
        "commit_message": "archive: Claude conversation - {topic}"
    }
}

# ============================================================================
# UTILS
# ============================================================================

class Config:
    """Configuration manager"""

    def __init__(self, config_path: Path = CONFIG_PATH):
        self.config_path = config_path
        self.config = self._load_config()

    def _load_config(self) -> Dict:
        """Load config from YAML or create default"""
        if self.config_path.exists():
            with open(self.config_path, 'r') as f:
                config = yaml.safe_load(f)
                logger.info(f"✅ Loaded config from {self.config_path}")
                return config
        else:
            logger.warning(f"⚠️  Config not found at {self.config_path}")
            logger.info("💡 Generating default config template...")
            self._save_default_config()
            return DEFAULT_CONFIG

    def _save_default_config(self):
        """Save default config to file"""
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.config_path, 'w') as f:
            yaml.dump(DEFAULT_CONFIG, f, default_flow_style=False)
        logger.info(f"📝 Default config saved to {self.config_path}")
        logger.info("⚠️  Please edit config and set CLAUDE_API_KEY")

    def get(self, key: str, default=None):
        """Get config value with dot notation"""
        keys = key.split('.')
        value = self.config
        for k in keys:
            value = value.get(k, {})
        return value or default

    @property
    def primary_vault(self) -> Path:
        return Path(self.get("vaults.primary"))

    @property
    def conversations_folder(self) -> Path:
        return self.primary_vault / self.get("output.folder")

    @property
    def api_key(self) -> str:
        key = self.get("sources.claude_chat.api_key")
        if key and key.startswith("${"):
            # Expand environment variable
            env_var = key.strip("${}")
            key = os.getenv(env_var)
        return key

# ============================================================================
# CONVERSATION MODELS
# ============================================================================

class Conversation:
    """Represents a single conversation"""

    def __init__(
        self,
        source: str,
        title: str,
        content: str,
        topic: str,
        date: datetime = None,
        duration_minutes: int = 0,
        participants: List[str] = None,
        tags: List[str] = None
    ):
        self.source = source  # "chat", "cowork", "code"
        self.title = title
        self.content = content
        self.topic = topic
        self.date = date or datetime.now()
        self.duration_minutes = duration_minutes
        self.participants = participants or ["Claude (Anthropic)", "Operations"]
        self.tags = tags or ["conversa-claude"]
        self.hash = self._compute_hash()

    def _compute_hash(self) -> str:
        """Compute hash of content for deduplication"""
        content_bytes = (self.title + self.content).encode('utf-8')
        return hashlib.md5(content_bytes).hexdigest()[:12]

    def to_markdown(self) -> str:
        """Convert to Obsidian markdown format"""
        date_str = self.date.strftime("%Y-%m-%d")

        # Frontmatter
        frontmatter = f"""---
title: "CC {date_str} {self.topic}"
date: {date_str}
type: conversa-claude
source: {self.source}
topic: {self.topic}
tags: {self.tags}
participants: {self.participants}
duration_minutes: {self.duration_minutes}
status: archived
content_hash: {self.hash}
---

"""

        # Content
        content = f"""# CC {date_str} {self.topic}

**Data:** {date_str}
**Fonte:** Claude {self.source.title()}
**Tema:** {self.topic}
**Duração:** ~{self.duration_minutes} min

## Conversação

{self.content}

---
**Arquivado em:** {datetime.now().strftime("%Y-%m-%d %H:%M UTC")}
**Status:** ✅ Arquivado
**Hash:** {self.hash}
"""

        return frontmatter + content

    @staticmethod
    def from_json(data: Dict, source: str = "chat") -> "Conversation":
        """Create Conversation from JSON (Claude API format)"""
        return Conversation(
            source=source,
            title=data.get("title", "Untitled"),
            content=data.get("content", ""),
            topic=data.get("summary", "General"),
            date=datetime.fromisoformat(data.get("created_at", datetime.now().isoformat())),
            duration_minutes=data.get("duration_minutes", 0),
            participants=data.get("participants", ["Claude", "User"]),
            tags=data.get("tags", [])
        )

# ============================================================================
# SOURCES
# ============================================================================

class ConversationSource:
    """Base class for conversation sources"""

    def fetch(self) -> List[Conversation]:
        """Fetch new conversations"""
        raise NotImplementedError

class ChatAPISource(ConversationSource):
    """Fetch conversations from Claude Chat API"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        logger.info("🔌 ChatAPISource initialized")

    def fetch(self) -> List[Conversation]:
        """Fetch conversations from Claude Chat"""
        logger.info("📡 Fetching from Claude Chat API...")

        # TODO: Implement actual API calls
        # For now, return empty list (Phase 2 implementation)
        logger.warning("⚠️  Claude Chat API fetch not yet implemented (Phase 2)")

        return []

class CoworkSource(ConversationSource):
    """Extract conversations from Cowork local data"""

    def __init__(self, app_data_path: str):
        self.app_data_path = Path(app_data_path)
        logger.info("🔌 CoworkSource initialized")

    def fetch(self) -> List[Conversation]:
        """Extract conversations from Cowork logs"""
        logger.info("📡 Extracting from Cowork local data...")

        # TODO: Implement Cowork log parsing
        # For now, return empty list (Phase 2 implementation)
        logger.warning("⚠️  Cowork log extraction not yet implemented (Phase 2)")

        return []

class CodeSource(ConversationSource):
    """Extract conversations from Claude Code CLI"""

    def __init__(self, session_logs: str):
        self.session_logs = Path(session_logs)
        logger.info("🔌 CodeSource initialized")

    def fetch(self) -> List[Conversation]:
        """Extract conversations from Code CLI logs"""
        logger.info("📡 Extracting from Claude Code CLI...")

        # TODO: Implement Code CLI log parsing
        # For now, return empty list (Phase 2 implementation)
        logger.warning("⚠️  Claude Code extraction not yet implemented (Phase 2)")

        return []

# ============================================================================
# STATE MANAGEMENT (Deduplication)
# ============================================================================

class ArchiverState:
    """Track archived conversations to avoid duplicates"""

    def __init__(self, state_file: Path = STATE_FILE):
        self.state_file = state_file
        self.state = self._load_state()

    def _load_state(self) -> Dict:
        """Load state from JSON"""
        if self.state_file.exists():
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return {"archived_hashes": [], "last_sync": None}

    def _save_state(self):
        """Save state to JSON"""
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)

    def is_archived(self, conversation_hash: str) -> bool:
        """Check if conversation already archived"""
        return conversation_hash in self.state["archived_hashes"]

    def mark_archived(self, conversation_hash: str):
        """Mark conversation as archived"""
        if conversation_hash not in self.state["archived_hashes"]:
            self.state["archived_hashes"].append(conversation_hash)
            self.state["last_sync"] = datetime.now().isoformat()
            self._save_state()
            logger.info(f"✅ Marked as archived: {conversation_hash}")

    def get_last_sync(self) -> Optional[datetime]:
        """Get last sync time"""
        last_sync = self.state.get("last_sync")
        if last_sync:
            return datetime.fromisoformat(last_sync)
        return None

# ============================================================================
# OBSIDIAN WRITER
# ============================================================================

class ObsidianWriter:
    """Write conversations to Obsidian vault"""

    def __init__(self, vault_path: Path, conversations_folder: str = "_conversas-claude"):
        self.vault_path = vault_path
        self.output_path = vault_path / conversations_folder
        self.output_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"✏️  ObsidianWriter pointing to {self.output_path}")

    def write(self, conversation: Conversation) -> Path:
        """Write conversation to markdown file"""
        # Generate filename
        date_str = conversation.date.strftime("%Y-%m-%d")
        # Sanitize topic for filename
        topic_safe = conversation.topic.replace(" ", "-").replace("/", "-")[:30]
        filename = f"CC {date_str} {topic_safe}.md"

        file_path = self.output_path / filename

        # Check if file already exists
        if file_path.exists():
            logger.warning(f"⚠️  File already exists, skipping: {filename}")
            return file_path

        # Write markdown
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(conversation.to_markdown())

        logger.info(f"✅ Saved conversation: {filename}")
        return file_path

# ============================================================================
# GIT AUTOMATION
# ============================================================================

class GitSync:
    """Automate Git commits and pushes"""

    def __init__(self, vault_path: Path, config: Config):
        self.vault_path = vault_path
        self.config = config
        logger.info(f"🔄 GitSync initialized for {vault_path}")

    def commit(self, message: str) -> bool:
        """Commit changes to git"""
        try:
            # cd into vault
            os.chdir(self.vault_path)

            # git add
            subprocess.run(["git", "add", "-A"], check=True, capture_output=True)
            logger.info("✅ git add -A")

            # git commit
            result = subprocess.run(
                ["git", "commit", "-m", message],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                logger.info(f"✅ git commit: {message}")
                return True
            else:
                logger.warning(f"⚠️  Nothing to commit or git error: {result.stderr}")
                return False

        except Exception as e:
            logger.error(f"❌ Git commit failed: {e}")
            return False

    def push(self) -> bool:
        """Push changes to remote"""
        try:
            os.chdir(self.vault_path)

            result = subprocess.run(
                ["git", "push", "origin", "main"],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                logger.info("✅ git push successful")
                return True
            else:
                logger.warning(f"⚠️  Git push warning: {result.stderr}")
                return False

        except Exception as e:
            logger.error(f"❌ Git push failed: {e}")
            return False

    def sync(self, commit_message: str = "archive: Claude conversations") -> bool:
        """Commit and push"""
        success = True

        if self.config.get("git.auto_commit", False):
            success = success and self.commit(commit_message)

        if success and self.config.get("git.auto_push", False):
            success = success and self.push()

        return success

# ============================================================================
# MAIN ARCHIVER
# ============================================================================

class ConversationArchiver:
    """Main archiver orchestrator"""

    def __init__(self, config_path: Path = CONFIG_PATH):
        self.config = Config(config_path)
        self.state = ArchiverState()
        self.writer = ObsidianWriter(
            self.config.primary_vault,
            self.config.get("output.folder", "_conversas-claude")
        )
        self.git_sync = GitSync(self.config.primary_vault, self.config)

        # Initialize sources
        self.sources = {}
        if self.config.get("sources.claude_chat.enabled", False):
            self.sources["chat"] = ChatAPISource(self.config.api_key)
        if self.config.get("sources.cowork.enabled", False):
            self.sources["cowork"] = CoworkSource(self.config.get("sources.cowork.app_data_path"))
        if self.config.get("sources.code.enabled", False):
            self.sources["code"] = CodeSource(self.config.get("sources.code.session_logs"))

    def run(self, dry_run: bool = False) -> bool:
        """Run archival cycle"""
        logger.info("=" * 70)
        logger.info("🚀 Starting Claude Conversation Archival Cycle")
        logger.info("=" * 70)

        total_archived = 0
        all_conversations = []

        # Fetch from all sources
        for source_name, source in self.sources.items():
            logger.info(f"\n📡 Fetching from {source_name}...")
            try:
                conversations = source.fetch()
                logger.info(f"   Found {len(conversations)} conversation(s)")
                all_conversations.extend(conversations)
            except Exception as e:
                logger.error(f"❌ Error fetching from {source_name}: {e}")

        # Process conversations
        logger.info(f"\n🔍 Processing {len(all_conversations)} conversation(s)...")

        for conv in all_conversations:
            # Deduplication check
            if self.state.is_archived(conv.hash):
                logger.warning(f"   ⏭️  Already archived: {conv.title} (hash: {conv.hash})")
                continue

            if dry_run:
                logger.info(f"   🔧 [DRY RUN] Would save: {conv.title}")
            else:
                # Write to Obsidian
                file_path = self.writer.write(conv)
                total_archived += 1

                # Mark as archived
                self.state.mark_archived(conv.hash)

        # Sync Git
        if total_archived > 0:
            logger.info(f"\n💾 Archived {total_archived} conversation(s)")

            if not dry_run:
                commit_msg = f"archive: {total_archived} Claude conversation(s)"
                self.git_sync.sync(commit_message=commit_msg)
        else:
            logger.info("\n📭 No new conversations to archive")

        logger.info("=" * 70)
        logger.info(f"✅ Archival cycle complete ({total_archived} new)")
        logger.info("=" * 70)

        return True

    def show_status(self) -> None:
        """Show archival status"""
        last_sync = self.state.get_last_sync()
        archived_count = len(self.state.state.get("archived_hashes", []))

        print("\n┌─────────────────────────────────────────┐")
        print("│  Claude Conversation Archival Status   │")
        print("├─────────────────────────────────────────┤")
        print(f"│ Total Archived:    {archived_count:>25}│")
        print(f"│ Last Sync:         {str(last_sync):>25}│")
        print(f"│ Vault Path:        {str(self.config.primary_vault)[:30]:>25}│")
        print(f"│ Config Path:       {str(CONFIG_PATH)[:30]:>25}│")
        print("│                                         │")
        print("│ Status: 🟢 Ready                       │")
        print("└─────────────────────────────────────────┘\n")

# ============================================================================
# CLI
# ============================================================================

def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(
        description="Claude Conversation Archiver - Capture and archive Claude conversations",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python claude_archiver.py                    # Run normal archival cycle
  python claude_archiver.py --dry-run         # Test without saving
  python claude_archiver.py --force           # Force immediate archival
  python claude_archiver.py --status          # Show status
        """
    )

    parser.add_argument("--dry-run", action="store_true", help="Test without saving")
    parser.add_argument("--force", action="store_true", help="Force immediate archival")
    parser.add_argument("--status", action="store_true", help="Show status and exit")
    parser.add_argument("--config", type=Path, default=CONFIG_PATH, help="Config file path")

    args = parser.parse_args()

    try:
        archiver = ConversationArchiver(args.config)

        if args.status:
            archiver.show_status()
        else:
            archiver.run(dry_run=args.dry_run)

    except Exception as e:
        logger.error(f"❌ Fatal error: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
