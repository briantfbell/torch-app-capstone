const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

// --- serial_end_items ---

const baseEndQuery = () => db('serial_end_items').select('*');

exports.getAllSerialEndItems = async query => {
  return await applyQueryFilters(baseEndQuery(), query);
};

exports.getSerialEndItemById = async id => {
  return await baseEndQuery().where('serial_end_items.id', id).first();
};

exports.getSerialEndItemsByUicId = async uic_id => {
  return await db('uics')
    .where('uics.id', uic_id)
    .join('users', 'uics.id', 'users.uic_id')
    .join('serial_end_items', 'users.id', 'serial_end_items.user_id')
    .select('serial_end_items.*');
};

<<<<<<< HEAD
exports.getSerialEndItemBySn = async (serial_number, uic_id) => {
  const query = baseEndQuery().where(
    'serial_end_items.serial_number',
    serial_number,
  );
  if (uic_id != null) query.where('serial_end_items.uic_id', uic_id);
  return await query.first();
=======
exports.getSerialEndItemBySn = async serial_number => {
  return await baseEndQuery()
    .where('serial_end_items.serial_number', serial_number)
    .first();
>>>>>>> 91b9bdc26931b56b4f1c55a8c2b4a2772b3a8aea
};

exports.createSerialEndItem = async (
  serialEndItemData,
  end_item_lin,
  user_dodid,
) => {
  const end_item = await db('end_items')
    .where('lin', end_item_lin)
    .select('id')
    .first();

  const user = await db('users')
    .where('dodid', user_dodid)
    .select('id')
    .first();

  const [serialEndItem] = await db('serial_end_items')
    .insert({
      ...serialEndItemData,
      end_item_id: end_item.id,
      user_id: user.id,
    })
    .returning('*');

  return serialEndItem;
};

exports.updateSerialEndItem = async (serialEndItemId, serialEndItemData) => {
  const [serialEndItem] = await db('serial_end_items')
    .where('id', serialEndItemId)
    .update(serialEndItemData)
    .returning('*');

  return serialEndItem;
};

exports.deleteSerialEndItem = async id => {
  return await db('serial_end_items').where('id', id).del().returning('*');
};
