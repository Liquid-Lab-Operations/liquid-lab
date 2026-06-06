/**
 * Graphify Service — Knowledge Graph Analysis for Liquid Lab
 * 
 * Runs in Nemoclaw sandbox (isolated, secure)
 * Outputs to ~/.nemoclaw/graphify-out/
 * 
 * Integration: Hermes agents request analysis via REST API
 * Output: HTML graphs, JSON data, linked in Liquid Lab Brain
 */

const express = require('express');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 7000;
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.env.HOME, '.nemoclaw/graphify-out');

app.use(express.json());

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'graphify',
    version: '1.0.0',
    outputDir: OUTPUT_DIR,
    timestamp: new Date().toISOString()
  });
});

/**
 * Submit Analysis Request
 * POST /analyze
 * 
 * Body: {
 *   "source": "path/to/file or URL",
 *   "type": "code|docs|conversation",
 *   "title": "Analysis Title",
 *   "tags": ["tag1", "tag2"]
 * }
 */
app.post('/analyze', async (req, res) => {
  try {
    const { source, type = 'docs', title, tags = [] } = req.body;
    const analysisId = `graph-${new Date().toISOString().split('T')[0]}`;
    const outputFile = path.join(OUTPUT_DIR, `${analysisId}.html`);
    
    if (!source) {
      return res.status(400).json({ error: 'source is required' });
    }

    // Run graphify analysis
    const command = `graphify analyze "${source}" --output "${outputFile}" --type ${type}`;
    
    execSync(command, { 
      stdio: 'pipe',
      env: { ...process.env }
    });

    // Create metadata file
    const metadata = {
      id: analysisId,
      title: title || `Analysis of ${source}`,
      source,
      type,
      tags: [...tags, 'graphify-analysis'],
      createdAt: new Date().toISOString(),
      outputFile,
      status: 'completed'
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${analysisId}.json`),
      JSON.stringify(metadata, null, 2)
    );

    res.status(201).json({
      id: analysisId,
      title: metadata.title,
      outputFile,
      status: 'completed',
      metadata
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

/**
 * Get Analysis
 * GET /analyze/:id
 */
app.get('/analyze/:id', (req, res) => {
  try {
    const metadataFile = path.join(OUTPUT_DIR, `${req.params.id}.json`);
    
    if (!fs.existsSync(metadataFile)) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
});

/**
 * List Analyses
 * GET /analyses
 */
app.get('/analyses', (req, res) => {
  try {
    const files = fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8')))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ 
      total: files.length,
      analyses: files 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list analyses' });
  }
});

/**
 * Get Graphify Version
 */
app.get('/version', (req, res) => {
  try {
    const version = execSync('graphify --version', { encoding: 'utf8' }).trim();
    res.json({ graphify: version });
  } catch (error) {
    res.json({ graphify: 'unknown' });
  }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`[Graphify] Knowledge Graph Service running on port ${PORT}`);
  console.log(`[Graphify] Output directory: ${OUTPUT_DIR}`);
  console.log(`[Graphify] Running in Nemoclaw sandbox (isolated)`);
});

module.exports = app;
