const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

// --- history_end_current ---

const baseQuery = () => db('history_end_current').select('*');

exports.getCurrentHistory = async query => {
  return await applyQueryFilters(baseQuery(), query);
};

exports.getCurrentHistoryById = async id => {
  return await baseQuery().where('history_end_current.id', id).first();
};

exports.getCurrentHistoryBySn = async sn => {
  const serial_end_item = await db('serial_end_items')
    .where('serial_end_items.serial_number', sn.serial_number)
    .select('id')
    .first();

  console.log(serial_end_item.id);

  console.log(
    await db('history_end_current')
      .where('history_end_current.serial_number', serial_end_item.id)
      .select('*'),
  );

  return await db('history_end_current')
    .where('history_end_current.serial_number', serial_end_item.id)
    .select('*')
    .first();
};

exports.createCurrentHistory = async currentHistoryData => {
  const [currentHistory] = await db('history_end_current')
    .insert(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.updateCurrentHistory = async (currentHistoryId, currentHistoryData) => {
  if (currentHistoryData.serial_number) {
    serial_end_item = await db('serial_end_items')
      .where('serial_end_items.serial_number', currentHistoryData.serial_number)
      .select('id')
      .first();

    currentHistoryData.serial_number = serial_end_item.id;
  }

  console.log(currentHistoryData);

  const [currentHistory] = await db('history_end_current')
    .where('id', currentHistoryId)
    .update(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.deleteCurrentHistory = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};

// --- history_component_current ---

const baseComponentQuery = () => db('history_component_current').select('*');

exports.getComponentCurrentHistory = async query => {
  return await applyQueryFilters(baseComponentQuery(), query);
};

exports.getComponentCurrentHistoryById = async id => {
  return await baseComponentQuery()
    .where('history_component_current.id', id)
    .first();
};

exports.createComponentCurrentHistory = async currentHistoryData => {
  const [currentHistory] = await db('history_component_current')
    .insert(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.updateComponentCurrentHistory = async (id, currentHistoryData) => {
  const [currentHistory] = await baseComponentQuery()
    .where('id', id)
    .update(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.deleteComponentCurrentHistory = async id => {
  return await baseComponentQuery().where('id', id).del().returning('*');
};
