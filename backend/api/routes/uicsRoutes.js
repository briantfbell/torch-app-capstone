const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getAllUics,
  getUicById,
  createUic,
  updateUic,
  deleteUic,
} = require('../controllers/uicsControllers');

router.get('/', getAllUics);
router.get('/:id', getUicById);
router.post('/', adminAuth, createUic);
router.patch('/:id', adminAuth, updateUic);
router.delete('/:id', adminAuth, deleteUic);

module.exports = router;
