const express = require('express');
const multer = require('multer');
const { createRaw } = require('../controllers/rawControllers');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/excel', upload.single('file'), createRaw);

module.exports = router;
