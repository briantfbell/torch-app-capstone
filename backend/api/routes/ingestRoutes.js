const express = require('express');
const auth = require('../middleware/auth'); //Use after testing
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/excel', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  readXlsxFile(req.file.buffer)
    .then(rows => {
      console.table(rows);
      console.table(rows[0].data);
      res.json({ data: rows });
    })
    .catch(err => {
      res.status(500).send('Error parsing file: ' + err.message);
    });
});

module.exports = router;
