'use strict';

const express = require('express');
const router = express.Router();
const recommendationsService = require('../services/recommendationsService');
const logger = require('../utils/logger');

router.get('/', async (req, res, next) => {
  try {
    const { sessionId, limit } = req.query;
    const recommendations = await recommendationsService.getRecommendations(
      sessionId || null,
      parseInt(limit || '6', 10)
    );
    res.json({ data: recommendations, count: recommendations.length });
  } catch (err) {
    logger.error('Error fetching recommendations', { error: err.message });
    next(err);
  }
});

module.exports = router;
