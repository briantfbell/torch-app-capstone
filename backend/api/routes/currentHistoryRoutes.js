const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getCurrentHistoryById,
  getCurrentHistory,
  createCurrentHistory,
  updateCurrentHistory,
  deleteCurrentHistory,
} = require('../controllers/currentHistoryControllers');

router.get('/:id', auth, getCurrentHistoryById);
router.get('/', auth, getCurrentHistory);
router.post('/', auth, createCurrentHistory);
router.patch('/:id', auth, updateCurrentHistory);
router.delete('/:id', auth, deleteCurrentHistory);

module.exports = router;
