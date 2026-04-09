const ingestModels = require('../models/ingestModels');
const { readSheet, parseData } = require('read-excel-file/node');

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
};

exports.ingest = async (file, user) => {
  const data = await readSheet(file.buffer);
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
    return;
  }

  for (const obj of objects) {
    if (obj.serial_number) {
      await ingestModels.insertSerializedItem(obj, user.id);
    } else {
      await ingestModels.insertComponent(obj);
    }
  }
};
