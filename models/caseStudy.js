'use strict';

const { query } = require('../utils/db');

const CaseStudy = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const result = await query(
      'SELECT * FROM case_studies ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async findBySlug(slug) {
    const result = await query('SELECT * FROM case_studies WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query('SELECT * FROM case_studies WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByIndustry(industryId) {
    const result = await query(
      'SELECT * FROM case_studies WHERE industry_id = $1 ORDER BY created_at DESC',
      [industryId]
    );
    return result.rows;
  },
};

module.exports = CaseStudy;
