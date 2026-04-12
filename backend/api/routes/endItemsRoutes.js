const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getEndItemsByUicId,
  getEndItemById,
  getAllEndItems,
  createEndItem,
  updateEndItem,
  deleteEndItem,
  markEndItemComplete,
} = require('../controllers/endItemsControllers');

router.get('/uic/:uic_id', getEndItemsByUicId);
router.get('/:id', getEndItemById);
router.get('/', getAllEndItems);
router.post('/', hrhAuth, createEndItem);
router.patch('/:id/complete', hrhAuth, markEndItemComplete);
router.patch('/:id', hrhAuth, updateEndItem);
router.delete('/:id', hrhAuth, deleteEndItem);

module.exports = router;
