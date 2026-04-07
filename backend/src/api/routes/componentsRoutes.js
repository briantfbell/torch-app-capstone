const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getComponentById,
  getAllComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/componentsControllers');

router.get('/:id', auth, getComponentById);
router.get('/', auth, getAllComponents);
router.post('/', auth, createComponent);
router.patch('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;
