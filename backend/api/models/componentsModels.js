const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () =>
  db('components')
    .join(
      'serial_component_items',
      'components.id',
      'serial_component_items.component_id',
    )
    .select('*');

exports.getAllComponents = async query => {
  const queryWithSerials = db('components')
    .leftJoin(
      'serial_component_items',
      'components.id',
      'serial_component_items.component_id',
    )
    .select(
      'components.*',
      db.raw(
        'json_agg(serial_component_items.*) filter (where serial_component_items.id is not null) as serialized_components',
      ),
    )
    .groupBy('components.id');

  return await applyQueryFilters(queryWithSerials, query);
};

exports.getComponentById = async id => {
  return await baseQuery().where('components.id', id).first();
};

exports.getComponentsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join('serial_end_items', 'users.id', 'serial_end_items.user_id')
    .join('end_items', 'serial_end_items.end_item_id', 'end_items.id')
    .join('components', 'end_items.id', 'components.end_item_id')
    .select('components.*');
};

exports.getComponentBySn = async serial_number => {
  return await db('serial_component_items')
    .where('serial_component_items.serial_number', serial_number)
    .first();
};

exports.createComponent = async (componentData, end_item_lin) => {
  const end_item = await db('end_items')
    .where('lin', end_item_lin)
    .select('id')
    .first();

  const [component] = await db('components')
    .insert({ ...componentData, end_item_id: end_item.id })
    .returning('*');

  return component;
};

exports.updateComponent = async (componentId, componentData) => {
  const [component] = await baseQuery()
    .where('id', componentId)
    .update(componentData)
    .returning('*');

  return component;
};

exports.deleteComponent = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};
