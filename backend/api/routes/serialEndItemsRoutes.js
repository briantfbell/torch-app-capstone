const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getSerialEndItemsByUicId,
  getSerialEndItemById,
  getAllSerialEndItems,
  createSerialEndItem,
  updateSerialEndItem,
  deleteSerialEndItem,
} = require('../controllers/serialEndItemsControllers');

router.get('/uic/:uic_id', getSerialEndItemsByUicId);
router.get('/:id', getSerialEndItemById);
router.get('/', getAllSerialEndItems);
router.post('/', hrhAuth, createSerialEndItem);
router.patch('/:id', hrhAuth, updateSerialEndItem);
router.delete('/:id', hrhAuth, deleteSerialEndItem);

module.exports = router;
