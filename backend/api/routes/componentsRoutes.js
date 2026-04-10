const express = require('express');
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

router.get('/uic/:uic_id', getComponentsByUicId);
router.get('/:id', getComponentById);
router.get('/', getAllComponents);
router.post('/', createComponent);
router.patch('/:id', adminAuth, updateComponent);
router.delete('/:id', adminAuth, deleteComponent);

module.exports = router;
