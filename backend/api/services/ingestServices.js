const ingestModels = require('../models/ingestModels');
const serialEndItemsModels = require('../models/serialEndItemsModels');
const serialComponentsModels = require('../models/serialComponentsModels');
const endItemsModels = require('../models/endItemsModels');
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

  const parseErrors = [];
  const objects = [];
  let row = 1;

  for (const { errors: errorsInRow, object } of results) {
    if (errorsInRow) {
      for (const error of errorsInRow) {
        parseErrors.push({ error, row });
      }
    } else {
      objects.push(object);
    }
    row++;
  }

  const crossUicSns = [];
  const missingEndItemLins = new Set();
  let insertedCount = 0;

  for (const obj of objects) {
    if (!obj.niin || !obj.end_item_lin) {
      parseErrors.push(obj);
      continue;
    }

    // Check if the referenced end item exists before inserting
    const endItem = await endItemsModels.getEndItemByLin(obj.end_item_lin);
    if (!endItem) {
      missingEndItemLins.add(obj.end_item_lin);
      continue;
    }

    if (obj.serial_number) {
      // Global SN check (null uicId = no UIC filter) to detect cross-UIC assignments
      const globalMatch = await serialComponentsModels.getSerialComponentBySn(
        obj.serial_number,
        null,
      );
      if (globalMatch) {
        if (globalMatch.uic_id === uicId) {
          parseErrors.push(obj); // duplicate within the same UIC
        } else {
          crossUicSns.push(obj.serial_number); // already assigned to a different UIC
        }
        continue;
      }
    }

    await ingestModels.insertComponent(obj, user.id, uicId);
    insertedCount++;
  }

  if (insertedCount === 0) {
    const uicString = await getUicString(uic);
    const uicLabel = uicString ? ` for UIC ${uicString}` : '';
    const error = new Error(`No new data${uicLabel}.`);
    error.status = 400;
    throw error;
  }

  const warnings = [];
  if (crossUicSns.length > 0) {
    warnings.push(
      `The following SNs are assigned to another UIC and were skipped: ${crossUicSns.join(', ')}.`,
    );
  }
  if (missingEndItemLins.size > 0) {
    warnings.push(
      `The following components were skipped because their end items have not been uploaded yet. Upload end items with these LINs first: ${[...missingEndItemLins].join(', ')}.`,
    );
  }

  return warnings.length > 0 ? { warnings } : null;
};

exports.ingestEndItems = async (file, user, uic) => {
  const data = await readSheet(file.buffer);
  const results = parseData(normalizeHeaders(data), schema);
  const uicId = uic ?? user.uic_id;

  const parseErrors = [];
  const objects = [];
  let row = 1;

  for (const { errors: errorsInRow, object } of results) {
    if (errorsInRow) {
      for (const error of errorsInRow) {
        parseErrors.push({ error, row });
      }
    } else {
      objects.push(object);
    }
    row++;
  }

  const crossUicSns = [];
  let insertedCount = 0;

  for (const obj of objects) {
    if (obj.serial_number) {
      // Global SN check (null uicId = no UIC filter) to detect cross-UIC assignments
      const globalMatch = await serialEndItemsModels.getSerialEndItemBySn(
        obj.serial_number,
        null,
      );
      if (globalMatch) {
        if (globalMatch.uic_id === uicId) {
          parseErrors.push(obj); // duplicate within the same UIC — skip silently
        } else {
          crossUicSns.push(obj.serial_number); // already assigned to a different UIC
        }
        continue;
      }
    }

    await ingestModels.insertSerializedItem(obj, user.id, uicId);
    insertedCount++;
  }

  if (insertedCount === 0) {
    const uicString = await getUicString(uic);
    const uicLabel = uicString ? ` for UIC ${uicString}` : '';
    const error = new Error(`No new data${uicLabel}.`);
    error.status = 400;
    throw error;
  }

  if (crossUicSns.length > 0) {
    return {
      warnings: [
        `The following SNs are assigned to another UIC and were skipped: ${crossUicSns.join(', ')}.`,
      ],
    };
  }

  return null;
};
