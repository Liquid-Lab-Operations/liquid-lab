#!/usr/bin/env node

/**
 * Process All — Capture, parse, and sync conversations
 * 
 * Uso:
 *   node scripts/process-all.js --file conversation.txt
 *   node scripts/process-all.js --stdin < conversation.txt
 */

const fs = require('fs');
const path = require('path');
const Parser = require('../src/parser');
const SyncService = require('../src/sync');

async function main() {
  const args = process.argv.slice(2);
  let input = '';
  let source = 'manual';
  let title = 'Untitled Conversation';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') {
      const filepath = args[++i];
      input = fs.readFileSync(filepath, 'utf8');
      source = path.basename(filepath).split('.')[0];
    } else if (args[i] === '--stdin') {
      input = fs.readFileSync(0, 'utf8');
    } else if (args[i] === '--source') {
      source = args[++i];
    } else if (args[i] === '--title') {
      title = args[++i];
    }
  }

  if (!input) {
    console.error('❌ Nenhuma entrada fornecida');
    console.error('Uso: node scripts/process-all.js --file conversation.txt');
    process.exit(1);
  }

  try {
    console.log('🚀 Knowledge Capture — Process All');
    console.log('==================================\n');

    // 1. Parse
    console.log('1️⃣ Parsing conversation...');
    const parser = new Parser();
    const parsed = parser.parse(input, source, { title });
    console.log(`   ✅ Parsed: ${parsed.id}\n`);

    // 2. Sync
    console.log('2️⃣ Syncing to destinations...');
    const sync = new SyncService();
    await sync.syncAll(parsed);
    console.log();

    // 3. Commit
    console.log('3️⃣ Committing to Git...');
    await sync.commitPending();
    console.log();

    // 4. Summary
    console.log('📊 Summary');
    console.log('==========');
    console.log(`Title: ${parsed.title}`);
    console.log(`Date: ${parsed.date}`);
    console.log(`Source: ${parsed.metadata.source}`);
    console.log(`Topics: ${parsed.metadata.topics.join(', ')}`);
    console.log(`Decisions: ${parsed.metadata.decisions.length}`);
    console.log(`Actions: ${parsed.metadata.actions.length}`);
    console.log(`Insights: ${parsed.metadata.insights.length}`);
    console.log();
    console.log('✅ Knowledge captured and synchronized!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
