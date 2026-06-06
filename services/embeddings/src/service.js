const Anthropic = require('@anthropic-ai/sdk');
const express = require('express');
const crypto = require('crypto');
const { Pool } = require('pg');
const logger = require('./logger');

// Initialize Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

/**
 * Generate embeddings using Claude
 */
async function generateEmbeddings(texts) {
  try {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    logger.info(`Generating embeddings for ${texts.length} texts`);

    // For demo, we'll use a simple approach
    // In production, use Anthropic's embeddings API or a dedicated service
    const embeddings = texts.map((text) => {
      // Placeholder: create a mock embedding based on text
      // Real implementation would use actual embeddings API
      return generateMockEmbedding(text);
    });

    return embeddings;
  } catch (error) {
    logger.error('Failed to generate embeddings', { error: error.message });
    throw error;
  }
}

/**
 * Generate mock embedding (placeholder)
 * In production, replace with actual embeddings API
 */
function generateMockEmbedding(text) {
  const size = 1536; // Claude embeddings size
  const hash = crypto.createHash('sha256').update(text).digest();

  const embedding = new Array(size).fill(0).map((_, i) => {
    return (hash.readUInt8(i % 32) / 255) * 2 - 1;
  });

  return embedding;
}

/**
 * Store embeddings in database
 */
async function storeEmbeddings(documentId, content, embedding) {
  const client = await pool.connect();

  try {
    const query = `
      INSERT INTO embeddings (document_id, content, embedding)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
      RETURNING id
    `;

    const result = await client.query(query, [
      documentId,
      content,
      JSON.stringify(embedding),
    ]);

    logger.info('Embedding stored', { documentId, embeddingId: result.rows[0]?.id });
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Similarity search using vector distance
 */
async function similaritySearch(queryEmbedding, limit = 5) {
  const client = await pool.connect();

  try {
    const query = `
      SELECT
        e.id,
        e.document_id,
        d.title,
        e.content,
        1 - (e.embedding <=> $1::vector) as similarity
      FROM embeddings e
      JOIN documents d ON e.document_id = d.id
      WHERE e.embedding IS NOT NULL
      ORDER BY e.embedding <=> $1::vector
      LIMIT $2
    `;

    const result = await client.query(query, [
      JSON.stringify(queryEmbedding),
      limit,
    ]);

    logger.info('Similarity search completed', { resultCount: result.rows.length });
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Process document and create embeddings
 */
async function processDocument(documentId, title, content) {
  try {
    logger.info('Processing document for embeddings', { documentId, title });

    // Split content into chunks for embedding
    const chunks = chunkText(content, 500);
    const embeddings = await generateEmbeddings(chunks);

    // Store embeddings
    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      const result = await storeEmbeddings(documentId, chunks[i], embeddings[i]);
      results.push(result);
    }

    logger.info('Document processed', { documentId, chunksCount: chunks.length });
    return results;
  } catch (error) {
    logger.error('Document processing failed', { error: error.message, documentId });
    throw error;
  }
}

/**
 * Split text into chunks
 */
function chunkText(text, chunkSize = 500) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    // Try to split at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      if (lastPeriod > start) {
        end = lastPeriod + 1;
      }
    }

    chunks.push(text.substring(start, end).trim());
    start = end;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

// Express API
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'embeddings',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Generate embeddings endpoint
 */
app.post('/embeddings/generate', async (req, res) => {
  try {
    const { texts } = req.body;

    if (!texts || (Array.isArray(texts) && texts.length === 0)) {
      return res.status(400).json({
        error: 'texts array is required',
      });
    }

    const embeddings = await generateEmbeddings(texts);

    res.json({
      success: true,
      count: embeddings.length,
      embeddings,
    });
  } catch (error) {
    logger.error('Embeddings generation error', { error: error.message });
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * Process document endpoint
 */
app.post('/embeddings/process-document', async (req, res) => {
  try {
    const { documentId, title, content } = req.body;

    if (!documentId || !content) {
      return res.status(400).json({
        error: 'documentId and content are required',
      });
    }

    const results = await processDocument(documentId, title, content);

    res.json({
      success: true,
      documentId,
      chunksProcessed: results.length,
    });
  } catch (error) {
    logger.error('Document processing error', { error: error.message });
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * Similarity search endpoint
 */
app.post('/embeddings/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'query is required',
      });
    }

    const queryEmbeddings = await generateEmbeddings(query);
    const results = await similaritySearch(queryEmbeddings[0], limit);

    res.json({
      success: true,
      query,
      results: results.map((r) => ({
        id: r.id,
        documentId: r.document_id,
        title: r.title,
        content: r.content,
        similarity: parseFloat(r.similarity).toFixed(4),
      })),
    });
  } catch (error) {
    logger.error('Similarity search error', { error: error.message });
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * RAG endpoint - Retrieve Augmented Generation
 */
app.post('/rag/query', async (req, res) => {
  try {
    const { query, maxResults = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'query is required',
      });
    }

    logger.info('RAG query received', { query });

    // Generate query embedding
    const queryEmbeddings = await generateEmbeddings(query);

    // Retrieve similar documents
    const retrievedDocs = await similaritySearch(queryEmbeddings[0], maxResults);

    // Format context for Claude
    const context = retrievedDocs
      .map((doc) => `[${doc.title}]\n${doc.content}`)
      .join('\n\n');

    res.json({
      success: true,
      query,
      retrievedDocs: retrievedDocs.length,
      context,
      documents: retrievedDocs,
    });
  } catch (error) {
    logger.error('RAG query error', { error: error.message });
    res.status(500).json({
      error: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  logger.info(`Embeddings service listening on port ${port}`);
});

module.exports = {
  generateEmbeddings,
  storeEmbeddings,
  similaritySearch,
  processDocument,
};
