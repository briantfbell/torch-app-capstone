const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getAllUics,
  getUicById,
  createUic,
  updateUic,
  deleteUic,
} = require('../controllers/uicControllers');

router.get('/', auth, getAllUics);
router.get('/:id', auth, getUicById);
router.post('/', auth, createUic);
router.patch('/:id', auth, updateUic);
router.delete('/:id', auth, deleteUic);

module.exports = router;
