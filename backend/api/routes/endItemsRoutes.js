const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getEndItemById,
  getAllEndItems,
  createEndItem,
  updateEndItem,
  deleteEndItem,
  markEndItemComplete,
} = require('../controllers/endItemsControllers');

router.get('/:id', auth, getEndItemById);
router.get('/', auth, getAllEndItems);
router.post('/', auth, createEndItem);
router.patch('/:id/complete', auth, markEndItemComplete);
router.patch('/:id', auth, updateEndItem);
router.delete('/:id', auth, deleteEndItem);

module.exports = router;
