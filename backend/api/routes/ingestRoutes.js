const express = require('express');
const multer = require('multer');
const { readSheet, parseData } = require('read-excel-file/node');
const auth = require('../middleware/auth');
const db = require('../../db/knex');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/excel', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // if (req.user.role !== 'hrh') {
  //   return res.status(403).json({ message: 'Only HRHs can upload files.' });
  // }

  try {
    const data = await readSheet(req.file.buffer);

    const schema = {
      uic: {
        column: 'DoD Activity Address Code',
        type: String,
        required: true,
      },
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
      },
      // cost: {
      //   column: 'Cost',
      //   type: Number,
      //   required: true,
      // },
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
        if (obj.serial_number) {
          // Items with a serial number go into end_items and serial_items
          const match = await db('serial_items')
            .where({ serial_number: obj.serial_number })
            .select('id')
            .first();

          if (match) {
            errors.push(obj);
          } else {
            await db.transaction(async trx => {
              const [existingUic, [endItem]] = await Promise.all([
                trx('uics').where({ uic: obj.uic }).select('id').first(),
                trx('end_items')
                  .insert({
                    lin: obj.lin,
                    fsc: obj.fsc,
                    niin: obj.niin,
                    description: obj.description,
                    auth_qty: obj.auth_qty,
                    cost: `$${((Math.random() * 100000000) / 100).toFixed(2)}`,
                  })
                  .returning(['id', 'cost']),
              ]);

              const inserts = [
                trx('serial_items').insert({
                  item_id: endItem.id,
                  serial_number: obj.serial_number,
                  user_id: req.user.id,
                  status: 'serviceable',
                  cost: endItem.cost,
                }),
              ];

              if (!existingUic) {
                inserts.push(trx('uics').insert({ uic: obj.uic }));
              }

              await Promise.all(inserts);
            });
          }
        } else {
          // Items without a serial number go into components only
          await db('components').insert({
            ui: obj.ui,
            niin: obj.niin,
            description: obj.description,
            auth_qty: obj.auth_qty,
            cost: `$${Math.round(Math.random() * 100000000)}`,
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
