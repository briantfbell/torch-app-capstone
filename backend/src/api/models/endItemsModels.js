const db = require('../../src/db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('end_items').select('*');

exports.getAllEndItems = async query => {
  const endItems = await applyQueryFilters(baseQuery(), query);

  return endItems;
};

exports.getEndItemById = async id => {
  return await baseQuery().where('end_items.id', id).first();
};

exports.createEndItem = async endItemData => {
  const [endItem] = await db('end_items').insert(endItemData).returning('*');

  return endItem;
};

exports.updateEndItem = async (endItemId, endItemData) => {
  const [endItem] = await baseQuery()
    .where('id', endItemId)
    .update(endItemData)
    .returning('*');

  return endItem;
};

exports.deleteEndItem = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};
