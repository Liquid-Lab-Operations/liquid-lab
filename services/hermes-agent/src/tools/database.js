const { Pool } = require('pg');
const logger = require('../logger');

class DatabaseTool {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', { error: err.message });
    });
  }

  /**
   * Execute a database query
   */
  async execute(query, params = []) {
    const client = await this.pool.connect();

    try {
      logger.debug('Executing database query', { query, params });

      const result = await client.query(query, params);

      logger.debug('Query executed successfully', {
        rowCount: result.rowCount,
        command: result.command,
      });

      return {
        success: true,
        rowCount: result.rowCount,
        rows: result.rows,
        command: result.command,
      };
    } catch (error) {
      logger.error('Database query failed', {
        error: error.message,
        query,
        code: error.code,
      });

      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get documents by search
   */
  async getDocuments(searchQuery, limit = 10) {
    const query = `
      SELECT id, title, content, created_at
      FROM documents
      WHERE
        title ILIKE $1 OR
        content ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const searchParam = `%${searchQuery}%`;
    return this.execute(query, [searchParam, limit]);
  }

  /**
   * Store agent log
   */
  async logAgentAction(agentId, message, level = 'INFO') {
    const query = `
      INSERT INTO agent_logs (agent_id, message, level, timestamp)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;

    return this.execute(query, [agentId, message, level]);
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentId) {
    const query = `
      SELECT id, name, status, last_activity
      FROM agents
      WHERE id = $1
    `;

    return this.execute(query, [agentId]);
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(agentId, status) {
    const query = `
      UPDATE agents
      SET status = $1, last_activity = NOW()
      WHERE id = $2
      RETURNING *
    `;

    return this.execute(query, [status, agentId]);
  }

  /**
   * Close database connection pool
   */
  async close() {
    await this.pool.end();
    logger.info('Database connection pool closed');
  }
}

module.exports = DatabaseTool;
