const express = require('express');
const auth = require('../middleware/auth');
<<<<<<< HEAD
const hrhAuth = require('../middleware/hrhAuth');
=======
// const adminAuth = require('../middleware/adminAuth');
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea

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
<<<<<<< HEAD
router.post('/', hrhAuth, createEndItem);
router.patch('/:id/complete', hrhAuth, markEndItemComplete);
router.patch('/:id', hrhAuth, updateEndItem);
router.delete('/:id', hrhAuth, deleteEndItem);
router.put('/:id', hrhAuth, updateEndItem);
=======
router.post('/', auth, createEndItem);
router.patch('/:id/complete', auth, markEndItemComplete);
router.patch('/:id', auth, updateEndItem);
router.delete('/:id', auth, deleteEndItem);
router.put('/:id', auth, updateEndItem);
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea

module.exports = router;
