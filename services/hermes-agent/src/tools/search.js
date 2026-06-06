const DatabaseTool = require('./database');
const logger = require('../logger');

class SearchTool {
  constructor() {
    this.database = new DatabaseTool();
  }

  /**
   * Search knowledge base
   */
  async search(query, limit = 5) {
    try {
      logger.debug('Searching knowledge base', { query, limit });

      // First, try to search documents in database
      const dbResult = await this.database.getDocuments(query, limit);

      if (!dbResult.success) {
        return {
          success: false,
          error: 'Database search failed',
          details: dbResult.error,
        };
      }

      const results = dbResult.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content.substring(0, 500), // Truncate for brevity
        createdAt: row.created_at,
        relevance: this.calculateRelevance(query, row),
      }));

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      logger.debug('Search completed', { resultCount: results.length });

      return {
        success: true,
        query,
        results: results.slice(0, limit),
        totalResults: results.length,
      };
    } catch (error) {
      logger.error('Search failed', { error: error.message });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate relevance score (simple implementation)
   */
  calculateRelevance(query, document) {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const titleLower = document.title.toLowerCase();
    const contentLower = document.content.toLowerCase();

    let score = 0;

    queryTerms.forEach((term) => {
      if (titleLower.includes(term)) {
        score += 10; // Title matches worth more
      }
      if (contentLower.includes(term)) {
        score += 1;
      }
    });

    return score;
  }

  /**
   * Search by tags
   */
  async searchByTags(tags, limit = 5) {
    try {
      logger.debug('Searching by tags', { tags, limit });

      const query = `
        SELECT DISTINCT d.id, d.title, d.content, d.created_at
        FROM documents d
        WHERE d.id IN (
          SELECT id FROM documents
          WHERE content @@ to_tsquery('english', $1)
        )
        LIMIT $2
      `;

      const tagQuery = tags.join(' | ');
      const result = await this.database.execute(query, [tagQuery, limit]);

      return result;
    } catch (error) {
      logger.error('Tag search failed', { error: error.message });

      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = SearchTool;
