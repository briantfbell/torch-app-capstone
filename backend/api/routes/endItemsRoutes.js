const express = require('express');
const adminAuth = require('../middleware/adminAuth');

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
router.post('/', createEndItem);
router.patch('/:id/complete', adminAuth, markEndItemComplete);
router.patch('/:id', adminAuth, updateEndItem);
router.delete('/:id', adminAuth, deleteEndItem);

module.exports = router;
