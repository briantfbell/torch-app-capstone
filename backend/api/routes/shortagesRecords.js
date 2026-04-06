const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getShortageById,
  getAllShortages,
  createShortage,
  updateShortage,
  deleteShortage,
} = require('../controllers/shortagesRecords');

// router.get('/:id', auth, getShortageById);
// router.get('/', auth, getAllShortages);
// router.post('/', auth, createShortage);
// router.patch('/:id', auth, updateShortage);
// router.delete('/:id', auth, deleteShortage);

module.exports = router;
