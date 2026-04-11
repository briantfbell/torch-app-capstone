const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getSerialItemsByUicId,
  getSerialItemById,
  getAllSerialItems,
  createSerialItem,
  updateSerialItem,
  deleteSerialItem,
} = require('../controllers/serialItemsControllers');

router.get('/uic/:uic_id', getSerialItemsByUicId);
router.get('/:id', getSerialItemById);
router.get('/', getAllSerialItems);
router.post('/', hrhAuth, createSerialItem);
router.patch('/:id', hrhAuth, updateSerialItem);
router.delete('/:id', hrhAuth, deleteSerialItem);

module.exports = router;
