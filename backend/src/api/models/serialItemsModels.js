const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('serial_items').select('*');

exports.getAllSerialItems = async query => {
  const serialItems = await applyQueryFilters(baseQuery(), query);

  return serialItems;
};

exports.getSerialItemById = async id => {
  return await baseQuery().where('serial_items.id', id).first();
};

exports.createSerialItem = async serialItemData => {
  const [serialItem] = await db('serial_items')
    .insert(serialItemData)
    .returning('*');

  return serialItem;
};

exports.updateSerialItem = async (serialItemId, serialItemData) => {
  const [serialItem] = await db('serial_items')
    .where('id', serialItemId)
    .update(serialItemData)
    .returning('*');

  return serialItem;
};

exports.deleteSerialItem = async id => {
  return await db('serial_items').where('id', id).del().returning('*');
};
