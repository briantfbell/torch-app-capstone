const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getHistoryById,
  getAllHistory,
  createHistory,
  updateHistory,
  deleteHistory,
} = require('../controllers/historyControllers');

router.get('/:id', auth, getHistoryById);
router.get('/', auth, getAllHistory);
router.post('/', auth, createHistory);
router.patch('/:id', auth, updateHistory);
router.delete('/:id', auth, deleteHistory);

module.exports = router;
