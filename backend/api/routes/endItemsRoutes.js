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
} = require('../controllers/endItemsControllers');

router.get('/:id', getEndItemById);
router.get('/', getAllEndItems);
router.post('/', createEndItem);
router.patch('/:id', updateEndItem);
router.delete('/:id', deleteEndItem);

module.exports = router;
