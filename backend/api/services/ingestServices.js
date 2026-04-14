const ingestModels = require('../models/ingestModels');
const serialEndItemsModels = require('../models/serialEndItemsModels');
const serialComponentsModels = require('../models/serialComponentsModels');
const uicsModels = require('../models/uicsModels');
const { readSheet, parseData } = require('read-excel-file/node');
const { schema, normalizeHeaders } = require('../helpers/ingestSchema');

const getUicId = async uicString => {
  if (!uicString) return null;
  const uic = await uicsModels.getUicByUic(uicString);
  return uic?.id ?? null;
};

exports.ingestComponents = async (file, user, overrideUic) => {
  const data = await readSheet(file.buffer);
  const results = parseData(normalizeHeaders(data), schema);
  const uicString = overrideUic ?? user.uic;
  const uicId = await getUicId(uicString);

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
    if (!obj.niin || !obj.end_item_lin) continue;

    if (obj.serial_number) {
      const match = await serialComponentsModels.getSerialComponentBySn(
        obj.serial_number,
      );
      if (match) {
        errors.push(obj);
        continue;
      }
    }

    await ingestModels.insertComponent(obj, user.id, uicId);
  }

  if (objects.length > 0 && errors.length === objects.length) {
    const error = Error(`No new data for UIC ${uicString}.`);
    error.status = 400;
    throw error;
  }
};

exports.ingestEndItems = async (file, user, overrideUic) => {
  const data = await readSheet(file.buffer);
  const results = parseData(normalizeHeaders(data), schema);
  const uicString = overrideUic ?? user.uic;
  const uicId = await getUicId(uicString);

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
      const match = await serialEndItemsModels.getSerialEndItemBySn(
        obj.serial_number,
      );

      if (match) {
        errors.push(obj);

        if (objects.length === errors.length) {
          const error = Error(`No new data for UIC ${uicString}.`);
          error.status = 400;
          throw error;
        }
      } else {
        await ingestModels.insertSerializedItem(obj, user.id, uicId);
      }
    }
  }
};
