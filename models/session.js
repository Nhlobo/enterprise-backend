'use strict';

const { query } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const Session = {
  async create(metadata = {}) {
    const sessionId = uuidv4();
    const result = await query(
      'INSERT INTO sessions (id, metadata) VALUES ($1, $2) RETURNING *',
      [sessionId, JSON.stringify(metadata)]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM sessions WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async update(id, metadata) {
    const result = await query(
      'UPDATE sessions SET metadata = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, JSON.stringify(metadata)]
    );
    return result.rows[0] || null;
  },
};

module.exports = Session;
