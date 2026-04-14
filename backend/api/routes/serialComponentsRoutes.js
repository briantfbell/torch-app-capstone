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

<<<<<<< HEAD
router.get('/uic/:uic_id', auth, getSerialComponentsByUicId);
router.get('/:id', auth, getSerialComponentById);
router.get('/', auth, getAllSerialComponents);
=======
router.get('/uic/:uic_id', getSerialComponentsByUicId);
router.get('/:id', getSerialComponentById);
router.get('/', getAllSerialComponents);
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea
router.post('/', hrhAuth, createSerialComponent);
router.patch('/:id', hrhAuth, updateSerialComponent);
router.delete('/:id', hrhAuth, deleteSerialComponent);

module.exports = router;
