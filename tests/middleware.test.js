'use strict';

const mockValidationResult = jest.fn();
jest.mock('express-validator', () => ({
  validationResult: mockValidationResult,
}));

const validateInput = require('../middleware/validateInput');

describe('validateInput middleware', () => {
  it('calls next() when there are no validation errors', () => {
    mockValidationResult.mockReturnValue({ isEmpty: () => true });

    const req = { body: {} };
    const res = {};
    const next = jest.fn();

    validateInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 422 when there are validation errors', () => {
    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Name is required', param: 'name' }],
    });

    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validateInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Name is required', param: 'name' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
