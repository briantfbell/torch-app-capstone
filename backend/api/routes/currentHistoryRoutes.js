const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getCurrentHistoryById,
  getCurrentHistory,
  createCurrentHistory,
  updateCurrentHistory,
  deleteCurrentHistory,
} = require('../controllers/currentHistoryControllers');

router.get('/:id', getCurrentHistoryById);
router.get('/', getCurrentHistory);
router.post('/', hrhAuth, createCurrentHistory);
router.patch('/:id', adminAuth, updateCurrentHistory);
router.delete('/:id', adminAuth, deleteCurrentHistory);

module.exports = router;
