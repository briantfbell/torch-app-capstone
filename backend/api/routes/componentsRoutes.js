const express = require('express');
const auth = require('../middleware/auth');
const hrhAuth = require('../middleware/hrhAuth');

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
router.post('/', hrhAuth, createComponent);
router.patch('/:id', hrhAuth, updateComponent);
router.delete('/:id', hrhAuth, deleteComponent);

module.exports = router;
