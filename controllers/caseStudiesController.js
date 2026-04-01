'use strict';

const CaseStudy = require('../models/caseStudy');
const logger = require('../utils/logger');

const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    const caseStudies = await CaseStudy.findAll({ limit, offset });
    res.json({ data: caseStudies, count: caseStudies.length });
  } catch (err) {
    logger.error('Error fetching case studies', { error: err.message });
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const caseStudy = await CaseStudy.findBySlug(req.params.slug);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    return res.json({ data: caseStudy });
  } catch (err) {
    logger.error('Error fetching case study by slug', { error: err.message });
    return next(err);
  }
};

const getByIndustry = async (req, res, next) => {
  try {
    const caseStudies = await CaseStudy.findByIndustry(req.params.industryId);
    res.json({ data: caseStudies, count: caseStudies.length });
  } catch (err) {
    logger.error('Error fetching case studies by industry', { error: err.message });
    next(err);
  }
};

module.exports = { getAll, getBySlug, getByIndustry };
