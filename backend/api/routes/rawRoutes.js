const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const { createRaw } = require('../controllers/rawControllers');

// router.get('/:id', auth);
// router.get('/', auth);
router.post('/', auth, createRaw);
// router.patch('/:id', auth);
// router.delete('/:id', auth);

module.exports = router;
