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

  if (!serial_end_item) return null;

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
    const serial_end_item = await db('serial_end_items')
      .where('serial_end_items.serial_number', currentHistoryData.serial_number)
      .select('id')
      .first();

    currentHistoryData.serial_number = serial_end_item.id;
  }

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

exports.getComponentCurrentHistoryBySn = async serial_number => {
  const serial_component_item = await db('serial_component_items')
    .where('serial_component_items.serial_number', serial_number)
    .select('id')
    .first();

  if (!serial_component_item) return null;

  return await db('history_component_current')
    .where('history_component_current.serial_number', serial_component_item.id)
    .select('*')
    .first();
};

exports.getUnserializedComponentCurrentHistory = async component_id => {
  return await db('history_component_current')
    .where('component_id', component_id)
    .whereNull('serial_number')
    .select('*')
    .first();
};

exports.createComponentCurrentHistory = async currentHistoryData => {
  const [currentHistory] = await db('history_component_current')
    .insert(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.updateComponentCurrentHistory = async (id, currentHistoryData) => {
  if (currentHistoryData.serial_number) {
    const serial_component_item = await db('serial_component_items')
      .where('serial_component_items.serial_number', currentHistoryData.serial_number)
      .select('id')
      .first();

    currentHistoryData.serial_number = serial_component_item.id;
  }

  const [currentHistory] = await baseComponentQuery()
    .where('id', id)
    .update(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.deleteComponentCurrentHistory = async id => {
  return await baseComponentQuery().where('id', id).del().returning('*');
};
