const express = require('express');
// const auth = require('../middleware/auth');
// const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getEndItemsByUicId,
  getEndItemById,
  getAllEndItems,
  createEndItem,
  markEndItemComplete,
  updateEndItem,
  deleteEndItem,
} = require('../controllers/endItemsControllers');

router.get('/uic/:uic_id', auth, getEndItemsByUicId);
router.get('/:id', auth, getEndItemById);
router.get('/', auth, getAllEndItems);
router.post('/', auth, createEndItem);
router.patch('/:id/complete', auth, markEndItemComplete);
router.patch('/:id', auth, updateEndItem);
router.delete('/:id', auth, deleteEndItem);
router.put('/:id', auth, updateEndItem);

module.exports = router;
