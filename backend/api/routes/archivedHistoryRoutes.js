const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getArchivedHistoryById,
  getArchivedHistory,
  createArchivedHistory,
  getComponentArchivedHistory,
  getComponentArchivedHistoryById,
  createComponentArchivedHistory,
} = require('../controllers/archivedHistoryControllers');

// End item history
router.get('/end-items/:id', getArchivedHistoryById);
router.get('/end-items', getArchivedHistory);
router.post('/end-items', hrhAuth, createArchivedHistory);

// Component history
router.get('/components/:id', getComponentArchivedHistoryById);
router.get('/components', getComponentArchivedHistory);
router.post('/components', hrhAuth, createComponentArchivedHistory);

module.exports = router;
