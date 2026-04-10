const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getComponentsByUicId,
  getComponentById,
  getAllComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/componentsControllers');

router.get('/uic/:uic_id', auth, getComponentsByUicId);
router.get('/:id', auth, getComponentById);
router.get('/', auth, getAllComponents);
router.post('/', auth, createComponent);
router.patch('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;
