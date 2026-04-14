const express = require('express');
<<<<<<< HEAD
const auth = require('../middleware/auth');
=======
const adminAuth = require('../middleware/adminAuth');
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea
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

<<<<<<< HEAD
router.get('/uic/:uic_id', auth, getSerialEndItemsByUicId);
router.get('/:id', auth, getSerialEndItemById);
router.get('/', auth, getAllSerialEndItems);
=======
router.get('/uic/:uic_id', getSerialEndItemsByUicId);
router.get('/:id', getSerialEndItemById);
router.get('/', getAllSerialEndItems);
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea
router.post('/', hrhAuth, createSerialEndItem);
router.patch('/:id', hrhAuth, updateSerialEndItem);
router.delete('/:id', hrhAuth, deleteSerialEndItem);

module.exports = router;
