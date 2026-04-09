const rawModels = require('../models/rawModels');
const { readSheet, parseData } = require('read-excel-file/node');

exports.createRaw = async ({ file }) => {
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const data = await readSheet(file.buffer);

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
        required: true,
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
      // ui: {
      //   column: 'Unit of Measure',
      //   type: String,
      //   required: true,
      // },
      // serial_number: {
      //   column: 'Serial Number',
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
        const match = await db('end_items')
          .where({
            niin: obj.niin,
            fsc: obj.fsc,
          })
          .select('id')
          .first();

        if (match) {
          errors.push(obj);
        } else {
          await db('end_items').insert(obj);
        }
      }
    }
  } catch (err) {
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
};
