const express = require('express');
const adminAuth = require('../middleware/adminAuth');
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

router.get('/uic/:uic_id', getComponentsByUicId);
router.get('/:id', getComponentById);
router.get('/', getAllComponents);
router.post('/', hrhAuth, createComponent);
router.patch('/:id', hrhAuth, updateComponent);
router.delete('/:id', hrhAuth, deleteComponent);

module.exports = router;
