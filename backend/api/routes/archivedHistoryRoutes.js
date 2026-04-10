const express = require('express');
const adminAuth = require('../middleware/adminAuth');

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
router.post('/', createArchivedHistory);
// router.patch('/:id',  adminAuth, updateArchivedHistory);
// router.delete('/:id',  adminAuth, deleteArchivedHistory);

module.exports = router;
