const express = require('express');
const auth = require('../middleware/auth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getByEndItemId,
  getAll,
  getById,
  create,
  update,
  del,
} = require('../controllers/currentHistoryComponentsControllers');

router.get('/end-item/:id', auth, getByEndItemId);
router.get('/:id', auth, getById);
router.get('/', auth, getAll);
router.post('/', hrhAuth, create);
router.patch('/:id', hrhAuth, update);
// router.delete('/:id', hrhAuth, del);

module.exports = router;
