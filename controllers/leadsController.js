'use strict';

const Lead = require('../models/lead');
const leadService = require('../services/leadService');
const logger = require('../utils/logger');

const create = async (req, res, next) => {
  try {
    const { name, email, company, phone, message, sessionId, consentGiven } = req.body;
    if (!consentGiven) {
      return res.status(422).json({ error: 'POPIA consent is required to submit this form.' });
    }
    const lead = await leadService.createLead({ name, email, company, phone, message, sessionId, consentGiven });
    return res.status(201).json({ data: lead, message: 'Lead submitted successfully.' });
  } catch (err) {
    logger.error('Error creating lead', { error: err.message });
    return next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    const leads = await Lead.findAll({ limit, offset });
    res.json({ data: leads, count: leads.length });
  } catch (err) {
    logger.error('Error fetching leads', { error: err.message });
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await Lead.deleteById(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error('Error deleting lead', { error: err.message });
    next(err);
  }
};

module.exports = { create, getAll, remove };
