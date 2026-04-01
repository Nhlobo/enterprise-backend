'use strict';

const express = require('express');
const router = express.Router();
const { getAll, getBySlug } = require('../controllers/industriesController');

router.get('/', getAll);
router.get('/:slug', getBySlug);

module.exports = router;
