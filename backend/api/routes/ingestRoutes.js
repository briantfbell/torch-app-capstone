const express = require('express');
const multer = require('multer');
const { readSheet, parseData } = require('read-excel-file/node');
const auth = require('../middleware/auth');
const db = require('../../db/knex');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/excel', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const data = await readSheet(req.file.buffer);

    const schema = {
      lin: {
        column: 'LIN Number / DODIC',
        type: String,
      },
      fsc: {
        column: 'FSC',
        type: Number,
        required: true,
      },
      niin: {
        column: 'Material',
        type: String,
      },
      description: {
        column: 'Material Description',
        type: String,
        required: true,
      },
      auth_qty: {
        column: 'Stock',
        type: Number,
        required: true,
      },
      ui: {
        column: 'Unit of Measure',
        type: String,
        required: true,
      },
      serial_number: {
        column: 'Serial Number',
        type: Number,
        required: true,
      },
    };

    const results = parseData(data, schema);
    const errors = [];
    const objects = [];

    let row = 1;

    for (const { errors: errorsInRow, object } of results) {
      if (errorsInRow) {
        for (const error of errorsInRow) {
          errors.push({ error, row });
        }
      } else {
        objects.push(object);
      }
      row++;
    }

    if (errors.length > 0) {
      for (const { error, row } of errors) {
        console.error(
          'Error in data row',
          row,
          'column',
          error.column,
          ':',
          error.error,
          error.reason || '',
        );
      }
    } else {
      // console.log('Objects:', objects);
      for (let obj of objects) {
        const match = await db('serial_items')
          .where({
            serial_number: obj.serial_number,
          })
          .select('id')
          .first();

        if (match) {
          errors.push(obj);
        } else {
          await db.transaction(async (trx) => {
            await Promise.all([
              trx('end_items').insert({
                lin: obj.lin,
                fsc: obj.fsc,
                niin: obj.niin,
                description: obj.description,
              }),
              trx('serial_items').insert({
                serial_number: obj.serial_number,
              }),
              trx('components').insert({
                ui: obj.ui,
                niin: obj.niin,
                description: obj.description,
              }),
            ]);
          });
        }
      }
    }

    res.status(201).json({ message: 'Success.' });
  } catch (err) {
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
});

module.exports = router;
