const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');

const {
  getIngestSchema,
  ingestComponents,
  ingestEndItems,
} = require('../controllers/ingestControllers');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/schema', getIngestSchema);
<<<<<<< HEAD
router.post(
  '/components/:uic_id',
  upload.single('file'),
  auth,
  ingestComponents,
);
router.post('/end-items/:uic_id', upload.single('file'), auth, ingestEndItems);
=======
router.post('/components', upload.single('file'), hrhAuth, ingestComponents);
router.post('/end-items', upload.single('file'), hrhAuth, ingestEndItems);
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea

module.exports = router;
