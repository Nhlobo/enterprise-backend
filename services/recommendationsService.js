'use strict';

const BehaviorLog = require('../models/behaviorLog');
const Solution = require('../models/solution');
const logger = require('../utils/logger');

const INDUSTRY_PAGE_WEIGHT = 1;
const SOLUTION_PAGE_WEIGHT = 2;

/**
 * Analyze behavior_logs for a session and dynamically recommend solutions.
 *
 * Logic:
 * 1. Fetch recent behavior logs for the session
 * 2. Extract page URLs visited (e.g. /industries/finance → industry slug = finance)
 * 3. Score solutions based on how often their related industry appears in logs
 * 4. Return top N solutions, falling back to latest solutions if no signal
 */
const getRecommendations = async (sessionId, limit = 6) => {
  logger.info('Generating recommendations', { sessionId });

  let logs = [];
  if (sessionId) {
    logs = await BehaviorLog.findRecentBySessionId(sessionId, 50);
  }

  const industryScores = {};
  for (const log of logs) {
    const match = (log.page_url || '').match(/\/industries\/([^/?#]+)/);
    if (match) {
      const slug = match[1];
      industryScores[slug] = (industryScores[slug] || 0) + INDUSTRY_PAGE_WEIGHT;
    }
    const solutionMatch = (log.page_url || '').match(/\/solutions\/([^/?#]+)/);
    if (solutionMatch) {
      const slug = solutionMatch[1];
      industryScores[slug] = (industryScores[slug] || 0) + SOLUTION_PAGE_WEIGHT;
    }
  }

  const allSolutions = await Solution.findAll({ limit: 100 });

  if (Object.keys(industryScores).length === 0) {
    return allSolutions.slice(0, limit);
  }

  const scored = allSolutions.map((sol) => ({
    ...sol,
    _score: industryScores[sol.industry_slug] || 0,
  }));

  scored.sort((a, b) => b._score - a._score);

  return scored.slice(0, limit).map(({ _score: _s, ...sol }) => sol);
};

module.exports = { getRecommendations };
