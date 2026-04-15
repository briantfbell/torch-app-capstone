const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getSerialComponentsByUicId,
  getSerialComponentById,
  getAllSerialComponents,
  createSerialComponent,
  updateSerialComponent,
  deleteSerialComponent,
} = require('../controllers/serialComponentsControllers');

router.get('/uic/:uic_id', getSerialComponentsByUicId);
router.get('/:id', getSerialComponentById);
router.get('/', getAllSerialComponents);
router.post('/', hrhAuth, createSerialComponent);
router.patch('/:id', hrhAuth, updateSerialComponent);
router.delete('/:id', hrhAuth, deleteSerialComponent);

module.exports = router;
