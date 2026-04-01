'use strict';

const logger = require('../utils/logger');

const loggingMiddleware = (req, _res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
};

module.exports = loggingMiddleware;
