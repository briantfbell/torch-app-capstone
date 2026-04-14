const db = require('../../db/knex');
const endItemsModels = require('../models/endItemsModels');

exports.insertSerializedItem = async (obj, userId, uicId) => {
  const match = await db('serial_end_items')
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
          image: obj.image
        })
        .returning(['id', 'cost']),
    ]);

    await trx('serial_end_items').insert({
      end_item_id: endItem.id,
      serial_number: obj.serial_number,
      user_id: userId,
      uic_id: uicId ?? null,
      status: 'serviceable',
    });
  });
};

exports.insertComponent = async (obj, userId, uicId) => {
  const end_item = await endItemsModels.getEndItemByLin(obj.end_item_lin);

  if (!end_item) return;

  await db.transaction(async trx => {
    const [component] = await trx('components')
      .insert({
        niin: obj.niin,
        description: obj.description,
        ui: obj.ui,
        auth_qty: obj.auth_qty || 1,
        end_item_id: end_item.id,
        cost: (Math.random() * 1000).toFixed(2),
      })
      .returning('id');

    if (obj.serial_number) {
      await trx('serial_component_items').insert({
        component_id: component.id,
        serial_number: obj.serial_number,
        user_id: userId,
        uic_id: uicId ?? null,
        status: 'serviceable',
      });
    }
  });
};
