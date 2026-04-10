const express = require('express');
const multer = require('multer');
const {
  ingestComponents,
  ingestEndItems,
} = require('../controllers/ingestControllers');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/components', upload.single('file'), ingestComponents);
router.post('/end-items', upload.single('file'), ingestEndItems);

module.exports = router;
