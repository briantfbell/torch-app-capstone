const express = require('express');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const { getAll, getById, create } = require('../controllers/archivedHistoryEndItemsControllers');

router.get('/:id', getById);
router.get('/', getAll);
router.post('/', hrhAuth, create);

module.exports = router;
