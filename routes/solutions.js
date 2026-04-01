'use strict';

const express = require('express');
const router = express.Router();
const { getAll, getBySlug, getByIndustry } = require('../controllers/solutionsController');

router.get('/', getAll);
router.get('/industry/:industryId', getByIndustry);
router.get('/:slug', getBySlug);

module.exports = router;
