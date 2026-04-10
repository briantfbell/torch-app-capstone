const express = require('express');
const multer = require('multer');
const {
  ingestComponents,
  ingestEndItems,
} = require('../controllers/ingestControllers');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/components', auth, upload.single('file'), ingestComponents);
router.post('/end-items', auth, upload.single('file'), ingestEndItems);

module.exports = router;
