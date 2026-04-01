'use strict';

const { query } = require('../utils/db');

const BehaviorLog = {
  async create({ sessionId, eventType, pageUrl, metadata = {} }) {
    const result = await query(
      'INSERT INTO behavior_logs (session_id, event_type, page_url, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
      [sessionId, eventType, pageUrl, JSON.stringify(metadata)]
    );
    return result.rows[0];
  },

  async findBySessionId(sessionId) {
    const result = await query(
      'SELECT * FROM behavior_logs WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    return result.rows;
  },

  async findRecentBySessionId(sessionId, limit = 20) {
    const result = await query(
      'SELECT * FROM behavior_logs WHERE session_id = $1 ORDER BY created_at DESC LIMIT $2',
      [sessionId, limit]
    );
    return result.rows;
  },
};

module.exports = BehaviorLog;
