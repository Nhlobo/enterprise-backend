'use strict';

const Solution = require('../models/solution');
const logger = require('../utils/logger');

const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    const solutions = await Solution.findAll({ limit, offset });
    res.json({ data: solutions, count: solutions.length });
  } catch (err) {
    logger.error('Error fetching solutions', { error: err.message });
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const solution = await Solution.findBySlug(req.params.slug);
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }
    return res.json({ data: solution });
  } catch (err) {
    logger.error('Error fetching solution by slug', { error: err.message });
    return next(err);
  }
};

const getByIndustry = async (req, res, next) => {
  try {
    const solutions = await Solution.findByIndustry(req.params.industryId);
    res.json({ data: solutions, count: solutions.length });
  } catch (err) {
    logger.error('Error fetching solutions by industry', { error: err.message });
    next(err);
  }
};

module.exports = { getAll, getBySlug, getByIndustry };
