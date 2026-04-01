'use strict';

const { query } = require('../utils/db');

const Solution = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const result = await query(
      'SELECT * FROM solutions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async findBySlug(slug) {
    const result = await query('SELECT * FROM solutions WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query('SELECT * FROM solutions WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Find multiple solutions by their IDs.
   * @param {number[]} ids - Array of solution IDs to fetch.
   * @returns {Promise<Object[]>} Array of matching solution rows.
   */
  async findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const result = await query(
      `SELECT * FROM solutions WHERE id IN (${placeholders})`,
      ids
    );
    return result.rows;
  },

  async findByIndustry(industryId) {
    const result = await query(
      'SELECT * FROM solutions WHERE industry_id = $1 ORDER BY created_at DESC',
      [industryId]
    );
    return result.rows;
  },
};

module.exports = Solution;
