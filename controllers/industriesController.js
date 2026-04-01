'use strict';

const Industry = require('../models/industry');
const logger = require('../utils/logger');

const getAll = async (_req, res, next) => {
  try {
    const industries = await Industry.findAll();
    res.json({ data: industries, count: industries.length });
  } catch (err) {
    logger.error('Error fetching industries', { error: err.message });
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const industry = await Industry.findBySlug(req.params.slug);
    if (!industry) {
      return res.status(404).json({ error: 'Industry not found' });
    }
    return res.json({ data: industry });
  } catch (err) {
    logger.error('Error fetching industry by slug', { error: err.message });
    return next(err);
  }
};

module.exports = { getAll, getBySlug };
