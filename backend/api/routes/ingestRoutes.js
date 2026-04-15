const express = require('express');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const {
  getIngestSchema,
  ingestComponents,
  ingestEndItems,
} = require('../controllers/ingestControllers');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/schema', getIngestSchema);
router.post('/components', upload.single('file'), hrhAuth, ingestComponents);
router.post('/end-items', upload.single('file'), hrhAuth, ingestEndItems);

module.exports = router;
