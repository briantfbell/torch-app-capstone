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
} = require('../controllers/uicsControllers');

router.get('/', getAllUics);
router.get('/:id', getUicById);
router.post('/', auth, adminAuth, createUic);
router.patch('/:id', auth, adminAuth, updateUic);
router.delete('/:id', auth, adminAuth, deleteUic);

module.exports = router;
