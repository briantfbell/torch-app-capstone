const express = require('express');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');
const auth = require('../middleware/auth');

const {
    getIngestSchema,
    ingestComponents,
    ingestEndItems,
} = require('../controllers/ingestControllers');

const upload = multer({storage: multer.memoryStorage()});
const router = express.Router();

router.get('/schema', getIngestSchema);
router.post(
    '/components/:uic_id',
    upload.single('file'),
    auth,
    ingestComponents,
);
router.post('/end-items/:uic_id', upload.single('file'), auth, ingestEndItems);

module.exports = router;
