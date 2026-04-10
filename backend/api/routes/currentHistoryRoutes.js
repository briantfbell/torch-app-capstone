const express = require('express');
const adminAuth = require('../middleware/adminAuth');

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
router.post('/', createCurrentHistory);
router.patch('/:id', adminAuth, updateCurrentHistory);
router.delete('/:id', adminAuth, deleteCurrentHistory);

module.exports = router;
