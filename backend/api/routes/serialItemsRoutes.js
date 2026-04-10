const express = require('express');
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

router.get('/uic/:uic_id', getSerialItemsByUicId);
router.get('/:id', getSerialItemById);
router.get('/', getAllSerialItems);
router.post('/', createSerialItem);
router.patch('/:id', adminAuth, updateSerialItem);
router.delete('/:id', adminAuth, deleteSerialItem);

module.exports = router;
