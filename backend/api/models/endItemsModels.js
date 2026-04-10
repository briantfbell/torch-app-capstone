const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('end_items').select('*');

exports.getAllEndItems = async query => {
  const endItems = await applyQueryFilters(baseQuery(), query);

  return endItems;
};

exports.getEndItemById = async id => {
  return await baseQuery().where('end_items.id', id).first();
};

exports.getEndItemsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join('serial_end_items', 'users.id', 'serial_end_items.user_id')
    .join('end_items', 'serial_end_items.end_item_id', 'end_items.id')
    .select('end_items.*');
};

exports.getEndItemByLin = async lin => {
  return await baseQuery().where('end_items.lin', lin).first();
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
