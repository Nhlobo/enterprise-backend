'use strict';

const { query } = require('../utils/db');

const Lead = {
  async create({ name, email, company, phone, message, sessionId, consentGiven }) {
    const result = await query(
      `INSERT INTO leads (name, email, company, phone, message, session_id, consent_given)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, company || null, phone || null, message || null, sessionId || null, consentGiven]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findAll({ limit = 50, offset = 0 } = {}) {
    const result = await query(
      'SELECT id, name, email, company, phone, message, session_id, consent_given, created_at FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await query(
      'UPDATE leads SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, status]
    );
    return result.rows[0] || null;
  },

  async deleteById(id) {
    await query('DELETE FROM leads WHERE id = $1', [id]);
  },
};

module.exports = Lead;
