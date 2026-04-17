const express = require('express');
const auth = require('../middleware/auth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getComponents,
  postComponents,
} = require('../controllers/inventoryControllers');

router.get('/components/:id', auth, getComponents);
router.post('/update', auth, postComponents);

module.exports = router;
