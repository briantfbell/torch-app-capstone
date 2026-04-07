const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank_id', 'ranks.id')
    .join('uics', 'users.uic_id', 'uics.id')
    .join('serial_items', 'users.id', 'serial_items.signed_to')
    .join('end_items', 'serial_items.item_id', 'end_items.id')
    .join('components', 'end_items.id', 'components.end_item_id');

exports.getAllComponents = async query => {
  const components = await applyQueryFilters(baseQuery(), query);

  return components;
};

exports.getComponentById = async id => {
  return await baseQuery().where('components.id', id).first();
};

exports.createComponent = async componentData => {
  const [component] = await db('components')
    .insert(componentData)
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
