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
} = require('../controllers/currentHistoryEndItemsControllers');

router.get('/:id', getById);
router.get('/', getAll);
router.post('/', hrhAuth, create);
router.patch('/:id', hrhAuth, update);
// router.delete('/:id', hrhAuth, del);

module.exports = router;
