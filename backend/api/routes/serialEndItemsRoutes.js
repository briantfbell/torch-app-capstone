const express = require('express');
const auth = require('../middleware/auth');
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

router.get('/uic/:uic_id', auth, getSerialEndItemsByUicId);
router.get('/:id', auth, getSerialEndItemById);
router.get('/', auth, getAllSerialEndItems);
router.post('/', hrhAuth, createSerialEndItem);
router.patch('/:id', hrhAuth, updateSerialEndItem);
router.delete('/:id', hrhAuth, deleteSerialEndItem);

module.exports = router;
