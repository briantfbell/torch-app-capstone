const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

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

exports.getSerialComponentItemsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join('serial_component_items', 'users.id', 'serial_component_items.user_id')
    .select('serial_component_items.*');
};

exports.getSerialComponentItemBySn = async serial_number => {
  return await baseComponentQuery()
    .where('serial_component_items.serial_number', serial_number)
    .first();
};

exports.createSerialComponentItem = async (
  serialComponentItemData,
  component_id,
  user_id,
) => {
  const [serialComponentItem] = await db('serial_component_items')
    .insert({ ...serialComponentItemData, component_id, user_id })
    .returning('*');

  return serialComponentItem;
};

exports.updateSerialComponentItem = async (id, serialComponentItemData) => {
  const [serialComponentItem] = await db('serial_component_items')
    .where('id', id)
    .update(serialComponentItemData)
    .returning('*');

  return serialComponentItem;
};

exports.deleteSerialComponentItem = async id => {
  return await db('serial_component_items')
    .where('id', id)
    .del()
    .returning('*');
};
