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

exports.getSerialItemBySn = async serial_number => {
  return await baseQuery()
    .where('serial_items.serial_number', serial_number)
    .first();
};

exports.createSerialItem = async (serialItemData, end_item_lin, user_dodid) => {
  const end_item_id = await db('end_items')
    .where('lin', end_item_lin)
    .select('id')
    .first();

  const user_id = await db('users')
    .where('dodid', user_dodid)
    .select('id')
    .first();

  const [serialItem] = await db('serial_items')
    .insert({
      ...serialItemData,
      item_id: end_item_id.id,
      user_id: user_id.id,
    })
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
