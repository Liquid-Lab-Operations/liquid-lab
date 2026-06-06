/**
 * Sync Service — Send processed conversations to destinations
 * Destinations: Obsidian, Graphify, Git
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

class SyncService {
  constructor(options = {}) {
    this.obsidianVault = options.obsidianVault || 
      path.join(process.env.HOME, 
        'Library/Mobile Documents/iCloud~md~obsidian/Documents/Liquid Lab Brain');
    
    this.conversationFolder = options.conversationFolder || '_conversas-claude';
    this.graphifyUrl = options.graphifyUrl || 'http://graphify:7000';
    this.projectRoot = options.projectRoot || 
      path.join(process.env.HOME, 'Claude/projects/liquid-lab');
  }

  /**
   * Sync parsed conversation to all destinations
   */
  async syncAll(parsedConversation) {
    console.log(`🔄 Sincronizando: ${parsedConversation.title}`);
    
    try {
      // 1. Save to Obsidian
      await this.syncToObsidian(parsedConversation);
      
      // 2. Analyze with Graphify
      await this.syncToGraphify(parsedConversation);
      
      // 3. Commit to Git
      await this.syncToGit(parsedConversation);
      
      console.log(`✅ Sincronização completa: ${parsedConversation.title}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro na sincronização:`, error.message);
      return false;
    }
  }

  /**
   * Save to Obsidian vault
   */
  async syncToObsidian(parsedConversation) {
    const { date, title, markdown, id } = parsedConversation;
    const filename = `${date}-${id.slice(0, 8)}.md`;
    const filepath = path.join(
      this.obsidianVault,
      this.conversationFolder,
      filename
    );

    // Ensure folder exists
    const folder = path.dirname(filepath);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filepath, markdown, 'utf8');
    console.log(`  ✅ Obsidian: ${filename}`);

    return filepath;
  }

  /**
   * Submit to Graphify for analysis
   */
  async syncToGraphify(parsedConversation) {
    const { date, title, metadata } = parsedConversation;
    
    try {
      const response = await axios.post(`${this.graphifyUrl}/analyze`, {
        source: `conversacao-${date}`,
        type: 'conversation',
        title: `Análise: ${title}`,
        tags: [
          'conversacao',
          ...metadata.topics,
          ...metadata.participants
        ]
      });

      console.log(`  ✅ Graphify: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.warn(`  ⚠️  Graphify unavailable (será retentado):`, error.message);
      return null;
    }
  }

  /**
   * Commit to Git
   */
  async syncToGit(parsedConversation) {
    const { date, title, metadata } = parsedConversation;
    
    try {
      const workingDir = path.join(
        this.projectRoot,
        'sessions/conversations'
      );

      // Ensure directory exists
      if (!fs.existsSync(workingDir)) {
        fs.mkdirSync(workingDir, { recursive: true });
      }

      const filename = `${date}-${title.replace(/\s+/g, '-').toLowerCase()}.json`;
      const filepath = path.join(workingDir, filename);

      // Save metadata as JSON
      fs.writeFileSync(
        filepath,
        JSON.stringify({
          ...parsedConversation,
          syncedAt: new Date().toISOString()
        }, null, 2),
        'utf8'
      );

      // Add to git
      execSync(`cd ${this.projectRoot} && git add sessions/conversations/${filename}`);

      console.log(`  ✅ Git: ${filename}`);
      return filepath;
    } catch (error) {
      console.warn(`  ⚠️  Git sync failed:`, error.message);
      return null;
    }
  }

  /**
   * Auto-commit all pending conversations
   */
  async commitPending() {
    try {
      execSync(`cd ${this.projectRoot} && git commit -m "chore: capture conversations from chat/code/cowork" || true`);
      console.log(`  ✅ Git commit done`);
    } catch (error) {
      console.log(`  ℹ️  No changes to commit`);
    }
  }
}

module.exports = SyncService;
