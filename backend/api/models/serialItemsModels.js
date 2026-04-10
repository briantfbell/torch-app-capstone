const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

// --- serial_end_items ---

const baseEndQuery = () => db('serial_end_items').select('*');

exports.getAllSerialItems = async query => {
  return await applyQueryFilters(baseEndQuery(), query);
};

exports.getSerialItemById = async id => {
  return await baseEndQuery().where('serial_end_items.id', id).first();
};

exports.getSerialItemsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join('serial_end_items', 'users.id', 'serial_end_items.user_id')
    .select('serial_end_items.*');
};

exports.getSerialItemBySn = async serial_number => {
  console.log(serial_number);
  return await baseEndQuery()
    .where('serial_end_items.serial_number', serial_number)
    .first();
};

exports.createSerialItem = async (serialItemData, end_item_lin, user_dodid) => {
  const end_item = await db('end_items')
    .where('lin', end_item_lin)
    .select('id')
    .first();

  const user = await db('users')
    .where('dodid', user_dodid)
    .select('id')
    .first();

  const [serialItem] = await db('serial_end_items')
    .insert({
      ...serialItemData,
      end_item_id: end_item.id,
      user_id: user.id,
    })
    .returning('*');

  return serialItem;
};

exports.updateSerialItem = async (serialItemId, serialItemData) => {
  const [serialItem] = await db('serial_end_items')
    .where('id', serialItemId)
    .update(serialItemData)
    .returning('*');

  return serialItem;
};

exports.deleteSerialItem = async id => {
  return await db('serial_end_items').where('id', id).del().returning('*');
};

// --- serial_component_items ---

const baseComponentQuery = () => db('serial_component_items').select('*');

exports.getAllSerialComponentItems = async query => {
  return await applyQueryFilters(baseComponentQuery(), query);
};

exports.getSerialComponentItemById = async id => {
  return await baseComponentQuery()
    .where('serial_component_items.id', id)
    .first();
};

exports.getSerialComponentItemBySn = async serial_number => {
  return await baseComponentQuery()
    .where('serial_component_items.serial_number', serial_number)
    .first();
};

exports.createSerialComponentItem = async (
  serialItemData,
  component_id,
  user_id,
) => {
  const [serialItem] = await db('serial_component_items')
    .insert({ ...serialItemData, component_id, user_id })
    .returning('*');

  return serialItem;
};

exports.updateSerialComponentItem = async (id, serialItemData) => {
  const [serialItem] = await db('serial_component_items')
    .where('id', id)
    .update(serialItemData)
    .returning('*');

  return serialItem;
};

exports.deleteSerialComponentItem = async id => {
  return await db('serial_component_items')
    .where('id', id)
    .del()
    .returning('*');
};
