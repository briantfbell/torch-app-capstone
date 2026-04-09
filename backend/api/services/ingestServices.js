const ingestModels = require('../models/ingestModels');
const serialItemsModels = require('../models/serialItemsModels');
const componentsModels = require('../models/componentsModels');
const { readSheet, parseData } = require('read-excel-file/node');
const { schema } = require('../helpers/ingestSchema');

exports.ingestComponent = async (file, user) => {
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

  for (const obj of objects) {
    if (obj.serial_number) {
      const match = await componentsModels.getComponentBySn(obj.serial_number);

      if (match) {
        errors.push(obj);

        if (objects.length === errors.length) {
          const error = Error('No new data.');
          error.status = 400;
          throw error;
        }
      } else {
        await ingestModels.insertComponent(obj);
      }
    }
  }
};

exports.ingestEndItems = async (file, user) => {
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

  for (const obj of objects) {
    if (obj.serial_number) {
      const match = await serialItemsModels.getSerialItemBySn(
        obj.serial_number,
      );

      if (match) {
        errors.push(obj);

        if (objects.length === errors.length) {
          const error = Error('No new data.');
          error.status = 400;
          throw error;
        }
      } else {
        await ingestModels.insertSerializedItem(obj);
      }
    }
  }
};
