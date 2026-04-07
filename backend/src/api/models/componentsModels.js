const db = require('../../src/db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('components').select('*');

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
