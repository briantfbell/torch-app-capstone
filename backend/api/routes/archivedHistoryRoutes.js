const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

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
// router.patch('/:id', auth, adminAuth, updateArchivedHistory);
// router.delete('/:id', auth, adminAuth, deleteArchivedHistory);

module.exports = router;
