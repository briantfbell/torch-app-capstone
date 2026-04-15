const express = require('express');
const auth = require('../middleware/auth');
const hrhAuth = require('../middleware/hrhAuth');

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
router.post('/', hrhAuth, createEndItem);
router.patch('/:id/complete', hrhAuth, markEndItemComplete);
router.patch('/:id', hrhAuth, updateEndItem);
router.delete('/:id', hrhAuth, deleteEndItem);


module.exports = router;
