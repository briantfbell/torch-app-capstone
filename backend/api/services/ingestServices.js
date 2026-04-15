const ingestModels = require('../models/ingestModels');
const serialEndItemsModels = require('../models/serialEndItemsModels');
const serialComponentsModels = require('../models/serialComponentsModels');
const uicsModels = require('../models/uicsModels');
const serialEndItemsModels = require('../models/serialEndItemsModels');
const serialComponentsModels = require('../models/serialComponentsModels');
const uicsModels = require('../models/uicsModels');
const { readSheet, parseData } = require('read-excel-file/node');
const { schema, normalizeHeaders } = require('../helpers/ingestSchema');

const getUicString = async uicId => {
  if (!uicId) return null;
  const uic = await uicsModels.getUicById(uicId);
  return uic?.uic ?? null;
};

exports.ingestComponents = async (file, user, uic) => {
  const data = await readSheet(file.buffer);
  const results = parseData(normalizeHeaders(data), schema);
  const uicId = uic ?? user.uic_id;

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
        uicId,
      );
      if (match) {
        errors.push(obj);
        continue;
      }
    }

    await ingestModels.insertComponent(obj, user.id, uicId);
    await ingestModels.insertComponent(obj, user.id, uicId);
  }

  if (objects.length > 0 && errors.length === objects.length) {
    const uicString = await getUicString(uic);
    const error = Error(`No new data for UIC ${uicString}.`);
    error.status = 400;
    throw error;
  }
};

exports.ingestEndItems = async (file, user, uic) => {
  const data = await readSheet(file.buffer);
  const results = parseData(normalizeHeaders(data), schema);
  const uicId = uic ?? user.uic_id;

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
      const match = await serialEndItemsModels.getSerialEndItemBySn(
        obj.serial_number,
        uicId,
      );

      if (match) {
        errors.push(obj);

        if (objects.length === errors.length) {
          const uicString = await getUicString(uic);
          const error = Error(`No new data for UIC ${uicString}.`);
          error.status = 400;
          throw error;
        }
      } else {
        await ingestModels.insertSerializedItem(obj, user.id, uicId);
        await ingestModels.insertSerializedItem(obj, user.id, uicId);
      }
    }
  }
};
