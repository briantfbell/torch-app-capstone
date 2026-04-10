const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getSerialItemsByUicId,
  getSerialItemById,
  getAllSerialItems,
  createSerialItem,
  updateSerialItem,
  deleteSerialItem,
} = require('../controllers/serialItemsControllers');

router.get('/uic/:uic_id', auth, getSerialItemsByUicId);
router.get('/:id', auth, getSerialItemById);
router.get('/', auth, getAllSerialItems);
router.post('/', auth, createSerialItem);
router.patch('/:id', auth, updateSerialItem);
router.delete('/:id', auth, deleteSerialItem);

module.exports = router;
