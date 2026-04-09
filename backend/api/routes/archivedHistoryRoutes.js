const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getArchivedHistoryById,
  getArchivedHistory,
  createArchivedHistory,
  // updateArchivedHistory,
  // deleteArchivedHistory,
} = require('../controllers/archivedHistoryControllers');

router.get('/:id', auth, getArchivedHistoryById);
router.get('/', auth, getArchivedHistory);
router.post('/', auth, createArchivedHistory);
// router.patch('/:id', auth, updateArchivedHistory);
// router.delete('/:id', auth, deleteArchivedHistory);

module.exports = router;
