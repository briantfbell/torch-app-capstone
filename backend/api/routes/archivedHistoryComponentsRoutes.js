const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getAll,
  getById,
  create,
} = require('../controllers/archivedHistoryComponentsControllers');

router.get('/:id', auth, getById);
router.get('/', auth, getAll);
router.post('/', hrhAuth, create);

module.exports = router;
