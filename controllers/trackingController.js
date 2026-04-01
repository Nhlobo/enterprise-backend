'use strict';

const BehaviorLog = require('../models/behaviorLog');
const Session = require('../models/session');
const logger = require('../utils/logger');

const trackEvent = async (req, res, next) => {
  try {
    const { sessionId, eventType, pageUrl, metadata } = req.body;
    let session = await Session.findById(sessionId);
    if (!session) {
      session = await Session.create({ userAgent: req.get('User-Agent'), ip: req.ip });
    }
    const log = await BehaviorLog.create({
      sessionId: session.id,
      eventType,
      pageUrl,
      metadata: metadata || {},
    });
    res.status(201).json({ data: log, sessionId: session.id });
  } catch (err) {
    logger.error('Error tracking event', { error: err.message });
    next(err);
  }
};

const getSessionLogs = async (req, res, next) => {
  try {
    const logs = await BehaviorLog.findBySessionId(req.params.sessionId);
    res.json({ data: logs, count: logs.length });
  } catch (err) {
    logger.error('Error fetching session logs', { error: err.message });
    next(err);
  }
};

module.exports = { trackEvent, getSessionLogs };
