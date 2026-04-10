const db = require('../../db/knex');
const endItemsModels = require('../models/endItemsModels');

exports.insertSerializedItem = async (obj, userId) => {
  const match = await db('serial_items')
    .where({ serial_number: obj.serial_number })
    .select('id')
    .first();

  if (match) {
    return;
  }

  await db.transaction(async trx => {
    const [[endItem]] = await Promise.all([
      trx('end_items')
        .insert({
          lin: obj.lin,
          fsc: obj.fsc,
          niin: obj.niin,
          description: obj.description,
          auth_qty: obj.auth_qty || 1,
          cost: (Math.random() * 10000).toFixed(2),
        })
        .returning(['id', 'cost']),
    ]);

    const inserts = [
      trx('serial_items').insert({
        item_id: endItem.id,
        serial_number: obj.serial_number,
        user_id: userId,
        status: 'serviceable',
      }),
    ];

    await Promise.all(inserts);
  });
};

exports.insertComponent = async obj => {
  const end_item = await endItemsModels.getEndItemByLin(obj.end_item_lin);

  if (!end_item) return;

  await db('components').insert({
    niin: obj.niin,
    description: obj.description,
    ui: obj.ui,
    auth_qty: obj.auth_qty || 1,
    end_item_id: end_item.id,
    serial_number: obj.serial_number || null,
    cost: (Math.random() * 1000).toFixed(2),
  });
};
