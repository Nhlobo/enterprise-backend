'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const loggingMiddleware = require('./middleware/logging');
const rateLimiter = require('./middleware/rateLimiter');

const solutionsRoutes = require('./routes/solutions');
const industriesRoutes = require('./routes/industries');
const caseStudiesRoutes = require('./routes/caseStudies');
const leadsRoutes = require('./routes/leads');
const trackingRoutes = require('./routes/tracking');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3001;

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(loggingMiddleware);
app.use(rateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/solutions', solutionsRoutes);
app.use('/api/industries', industriesRoutes);
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
