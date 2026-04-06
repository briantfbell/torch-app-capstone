const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getInventoryRecordById,
  getAllInventoryRecords,
  createInventoryRecord,
  updateInventoryRecord,
  deleteInventoryRecord,
} = require('../controllers/inventoryRecordsControllers');

// router.get('/:id', auth, getInventoryRecordById);
// router.get('/', auth, getAllInventoryRecords);
// router.post('/', auth, createInventoryRecord);
// router.patch('/:id', auth, updateInventoryRecord);
// router.delete('/:id', auth, deleteInventoryRecord);

module.exports = router;
