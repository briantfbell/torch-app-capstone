const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('components').select('*');

exports.getAllComponents = async query => {
  const components = await applyQueryFilters(baseQuery(), query);

  return components;
};

exports.getComponentById = async id => {
  return await baseQuery().where('components.id', id).first();
};

exports.getComponentBySn = async serial_number => {
  return await baseQuery()
    .where('components.serial_number', serial_number)
    .first();
};

exports.createComponent = async (componentData, end_item_lin) => {
  const end_item_id = await db('end_items')
    .where('lin', end_item_lin)
    .select('id')
    .first();

  const [component] = await db('components')
    .insert({ ...componentData, end_item_id: end_item_id.id })
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
