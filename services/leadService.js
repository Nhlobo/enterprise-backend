'use strict';

const Lead = require('../models/lead');
const logger = require('../utils/logger');

/**
 * POPIA-compliant lead creation.
 * Consent must be explicitly given before storing personal data.
 */
const createLead = async ({ name, email, company, phone, message, sessionId, consentGiven }) => {
  if (!consentGiven) {
    throw new Error('POPIA: Consent is required before storing personal information.');
  }
  if (!name || !email) {
    throw new Error('Name and email are required fields.');
  }

  logger.info('Creating lead with POPIA consent', { email, consentGiven });

  const lead = await Lead.create({ name, email, company, phone, message, sessionId, consentGiven });
  return lead;
};

module.exports = { createLead };
