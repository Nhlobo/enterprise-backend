'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateInput = require('../middleware/validateInput');
const { trackEvent, getSessionLogs } = require('../controllers/trackingController');

const trackValidation = [
  body('eventType').trim().notEmpty().withMessage('eventType is required'),
  body('pageUrl').trim().notEmpty().withMessage('pageUrl is required'),
  validateInput,
];

router.post('/', trackValidation, trackEvent);
router.get('/session/:sessionId', getSessionLogs);

module.exports = router;
