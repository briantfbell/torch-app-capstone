const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getReportsByCategory,
  getReportById,
  getAllReports,
  createReport,
  updateReport,
  deleteReport,
} = require('../controllers/reports-controller');

router.get('/category/:category', auth, getReportsByCategory);
router.get('/:id', auth, getReportById);
router.get('/', auth, getAllReports);
router.post('/', auth, createReport);
router.patch('/:id', auth, updateReport);
router.delete('/:id', auth, deleteReport);

module.exports = router;
