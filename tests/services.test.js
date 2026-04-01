'use strict';

jest.mock('../models/lead');
jest.mock('../models/behaviorLog');
jest.mock('../models/solution');

const leadService = require('../services/leadService');
const recommendationsService = require('../services/recommendationsService');
const Lead = require('../models/lead');
const BehaviorLog = require('../models/behaviorLog');
const Solution = require('../models/solution');

describe('leadService.createLead', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws if consent is not given', async () => {
    await expect(
      leadService.createLead({ name: 'Test', email: 'test@test.com', consentGiven: false })
    ).rejects.toThrow('POPIA');
  });

  it('throws if name is missing', async () => {
    await expect(
      leadService.createLead({ name: '', email: 'test@test.com', consentGiven: true })
    ).rejects.toThrow('Name and email are required');
  });

  it('creates lead when consent is given', async () => {
    const mockLead = { id: 1, name: 'Test User', email: 'test@example.com' };
    Lead.create.mockResolvedValue(mockLead);

    const result = await leadService.createLead({
      name: 'Test User',
      email: 'test@example.com',
      consentGiven: true,
    });

    expect(Lead.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
      consentGiven: true,
    }));
    expect(result).toEqual(mockLead);
  });
});

describe('recommendationsService.getRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all solutions when no session', async () => {
    const mockSolutions = [
      { id: 1, title: 'Sol A', industry_slug: 'finance' },
      { id: 2, title: 'Sol B', industry_slug: 'healthcare' },
    ];
    Solution.findAll.mockResolvedValue(mockSolutions);

    const result = await recommendationsService.getRecommendations(null, 6);
    expect(result).toEqual(mockSolutions);
  });

  it('scores solutions by behavior log industry slugs', async () => {
    BehaviorLog.findRecentBySessionId.mockResolvedValue([
      { page_url: '/industries/finance', event_type: 'pageview' },
      { page_url: '/industries/finance', event_type: 'pageview' },
    ]);
    Solution.findAll.mockResolvedValue([
      { id: 1, title: 'Finance Sol', industry_slug: 'finance' },
      { id: 2, title: 'Healthcare Sol', industry_slug: 'healthcare' },
    ]);

    const result = await recommendationsService.getRecommendations('session-123', 6);
    expect(result[0].title).toBe('Finance Sol');
  });
});
