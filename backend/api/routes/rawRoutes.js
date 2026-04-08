const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const { createRaw } = require('../controllers/rawControllers');

router.post('/', auth, createRaw);

module.exports = router;
