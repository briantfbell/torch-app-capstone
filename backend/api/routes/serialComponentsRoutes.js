const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getSerialComponentsByUicId,
  getSerialComponentById,
  getAllSerialComponents,
  createSerialComponent,
  updateSerialComponent,
  deleteSerialComponent,
} = require('../controllers/serialComponentsControllers');

router.get('/uic/:uic_id', auth, getSerialComponentsByUicId);
router.get('/:id', auth, getSerialComponentById);
router.get('/', auth, getAllSerialComponents);
router.post('/', hrhAuth, createSerialComponent);
router.patch('/:id', hrhAuth, updateSerialComponent);
router.delete('/:id', hrhAuth, deleteSerialComponent);

module.exports = router;
