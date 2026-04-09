const express = require('express');
const multer = require('multer');
const { ingest } = require('../controllers/ingestControllers');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/excel', auth, upload.single('file'), ingest);

module.exports = router;
