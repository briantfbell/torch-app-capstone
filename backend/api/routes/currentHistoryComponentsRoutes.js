const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  del,
} = require('../controllers/currentHistoryComponentsControllers');

router.get('/:id', getById);
router.get('/', getAll);
router.post('/', hrhAuth, create);
router.patch('/:id', adminAuth, update);
// router.delete('/:id', adminAuth, del);

module.exports = router;
