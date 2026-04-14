const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('history_component_current').select('*');

exports.getComponentCurrentHistory = async query => {
  return await applyQueryFilters(baseQuery(), query);
};

exports.getComponentCurrentHistoryById = async id => {
  return await baseQuery().where('history_component_current.id', id).first();
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

  const [currentHistory] = await db('history_component_current')
    .where('id', id)
    .update(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.deleteComponentCurrentHistory = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};
