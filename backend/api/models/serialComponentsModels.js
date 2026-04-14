const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

// --- serial_component_items ---

const baseComponentQuery = () => db('serial_component_items').select('*');

exports.getAllSerialComponents = async query => {
  return await applyQueryFilters(baseComponentQuery(), query);
};

exports.getSerialComponentById = async id => {
  return await baseComponentQuery()
    .where('serial_component_items.id', id)
    .first();
};

exports.getSerialComponentsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join(
      'serial_component_items',
      'users.id',
      'serial_component_items.user_id',
    )
    .select('serial_component_items.*');
};

exports.getSerialComponentBySn = async (serial_number, uic_id) => {
  const query = baseComponentQuery().where(
    'serial_component_items.serial_number',
    serial_number,
  );
  if (uic_id != null) query.where('serial_component_items.uic_id', uic_id);
  return await query.first();
};

exports.createSerialComponent = async (
  serialComponentData,
  component_id,
  user_id,
) => {
  const [serialComponent] = await db('serial_component_items')
    .insert({ ...serialComponentData, component_id, user_id })
    .returning('*');

  return serialComponent;
};

exports.updateSerialComponent = async (id, serialComponentData) => {
  const [serialComponent] = await db('serial_component_items')
    .where('id', id)
    .update(serialComponentData)
    .returning('*');

  return serialComponent;
};

exports.deleteSerialComponent = async id => {
  return await db('serial_component_items')
    .where('id', id)
    .del()
    .returning('*');
};
