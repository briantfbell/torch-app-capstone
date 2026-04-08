const db = require('../../db/knex');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank_id', 'ranks.id')
    .join('uics', 'users.uic_id', 'uics.id')
    .join('serial_items', 'users.id', 'serial_items.signed_to')
    .join('end_items', 'serial_items.item_id', 'end_items.id')
    .join('components', 'end_items.id', 'components.end_item_id')
    .select('*');

exports.createRaw = async rawData => {
  const [raw] = await baseQuery().insert(rawData).returning('*');

  return raw;
};
