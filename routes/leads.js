'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateInput = require('../middleware/validateInput');
const { create, getAll, remove } = require('../controllers/leadsController');

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('consentGiven').isBoolean().withMessage('Consent field must be a boolean'),
  validateInput,
];

router.post('/', leadValidation, create);
router.get('/', getAll);
router.delete('/:id', remove);

module.exports = router;
