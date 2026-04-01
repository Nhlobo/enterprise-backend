'use strict';

jest.mock('../models/solution');
jest.mock('../models/industry');
jest.mock('../models/caseStudy');
jest.mock('../models/lead');
jest.mock('../models/behaviorLog');
jest.mock('../models/session');
jest.mock('../services/recommendationsService');
jest.mock('../services/leadService');

const request = require('supertest');
const app = require('../server');

const Solution = require('../models/solution');
const Industry = require('../models/industry');
const CaseStudy = require('../models/caseStudy');
const BehaviorLog = require('../models/behaviorLog');
const Session = require('../models/session');
const recommendationsService = require('../services/recommendationsService');
const leadService = require('../services/leadService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/solutions', () => {
  it('returns list of solutions', async () => {
    Solution.findAll.mockResolvedValue([{ id: 1, title: 'Test Solution' }]);
    const res = await request(app).get('/api/solutions');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /api/solutions/:slug', () => {
  it('returns 404 when solution not found', async () => {
    Solution.findBySlug.mockResolvedValue(null);
    const res = await request(app).get('/api/solutions/nonexistent');
    expect(res.status).toBe(404);
  });

  it('returns solution when found', async () => {
    Solution.findBySlug.mockResolvedValue({ id: 1, slug: 'my-solution' });
    const res = await request(app).get('/api/solutions/my-solution');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('my-solution');
  });
});

describe('GET /api/industries', () => {
  it('returns list of industries', async () => {
    Industry.findAll.mockResolvedValue([{ id: 1, name: 'Finance' }]);
    const res = await request(app).get('/api/industries');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /api/case-studies', () => {
  it('returns list of case studies', async () => {
    CaseStudy.findAll.mockResolvedValue([{ id: 1, title: 'Case Study 1' }]);
    const res = await request(app).get('/api/case-studies');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('POST /api/leads', () => {
  it('returns 422 when name is missing', async () => {
    const res = await request(app).post('/api/leads').send({ email: 'test@test.com', consentGiven: true });
    expect(res.status).toBe(422);
  });

  it('returns 201 when lead is valid', async () => {
    leadService.createLead.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com' });
    const res = await request(app).post('/api/leads').send({
      name: 'John Doe',
      email: 'john@example.com',
      consentGiven: true,
    });
    expect(res.status).toBe(201);
  });
});

describe('POST /api/track', () => {
  it('returns 422 when eventType is missing', async () => {
    const res = await request(app).post('/api/track').send({ pageUrl: '/home' });
    expect(res.status).toBe(422);
  });

  it('tracks event successfully', async () => {
    Session.findById.mockResolvedValue(null);
    Session.create.mockResolvedValue({ id: 'test-session-id' });
    BehaviorLog.create.mockResolvedValue({ id: 1, event_type: 'pageview' });

    const res = await request(app).post('/api/track').send({
      eventType: 'pageview',
      pageUrl: '/home',
      sessionId: 'test-session-id',
    });
    expect(res.status).toBe(201);
  });
});

describe('GET /api/recommendations', () => {
  it('returns recommendations', async () => {
    recommendationsService.getRecommendations.mockResolvedValue([
      { id: 1, title: 'Recommended Solution' },
    ]);
    const res = await request(app).get('/api/recommendations');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});
