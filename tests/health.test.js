'use strict';

const request = require('supertest');
const app = require('../server');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('GET /nonexistent-route', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
