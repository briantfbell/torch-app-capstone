const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getSerialComponentItemsByUicId,
  getSerialComponentItemById,
  getAllSerialComponentItems,
  createSerialComponentItem,
  updateSerialComponentItem,
  deleteSerialComponentItem,
} = require('../controllers/serialComponentsController');

router.get('/uic/:uic_id', getSerialComponentItemsByUicId);
router.get('/:id', getSerialComponentItemById);
router.get('/', getAllSerialComponentItems);
router.post('/', hrhAuth, createSerialComponentItem);
router.patch('/:id', hrhAuth, updateSerialComponentItem);
router.delete('/:id', hrhAuth, deleteSerialComponentItem);

module.exports = router;
