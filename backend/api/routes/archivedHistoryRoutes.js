const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getArchivedHistoryById,
  getArchivedHistory,
  createArchivedHistory,
  // updateArchivedHistory,
  // deleteArchivedHistory,
} = require('../controllers/archivedHistoryControllers');

router.get('/:id', getArchivedHistoryById);
router.get('/', getArchivedHistory);
router.post('/', hrhAuth, createArchivedHistory);
// router.patch('/:id',  adminAuth, updateArchivedHistory);
// router.delete('/:id',  adminAuth, deleteArchivedHistory);

module.exports = router;
