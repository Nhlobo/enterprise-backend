'use strict';

const { query } = require('../utils/db');

const Industry = {
  async findAll() {
    const result = await query('SELECT * FROM industries ORDER BY name ASC');
    return result.rows;
  },

  async findBySlug(slug) {
    const result = await query('SELECT * FROM industries WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query('SELECT * FROM industries WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
};

module.exports = Industry;
