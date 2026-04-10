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
  getComponentCurrentHistory,
  getComponentCurrentHistoryById,
  createComponentCurrentHistory,
  updateComponentCurrentHistory,
  deleteComponentCurrentHistory,
} = require('../controllers/currentHistoryControllers');

// End item history
router.get('/end-items/:id', getCurrentHistoryById);
router.get('/end-items', getCurrentHistory);
router.post('/end-items', hrhAuth, createCurrentHistory);
router.patch('/end-items/:id', adminAuth, updateCurrentHistory);
router.delete('/end-items/:id', adminAuth, deleteCurrentHistory);

// Component history
router.get('/components/:id', getComponentCurrentHistoryById);
router.get('/components', getComponentCurrentHistory);
router.post('/components', hrhAuth, createComponentCurrentHistory);
router.patch('/components/:id', adminAuth, updateComponentCurrentHistory);
router.delete('/components/:id', adminAuth, deleteComponentCurrentHistory);

module.exports = router;
