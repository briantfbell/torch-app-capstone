const db = require('../../db/knex');

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
          cost: ((Math.random() * 100000000) / 100).toFixed(2),
        })
        .returning(['id', 'cost']),
    ]);

    const inserts = [
      trx('serial_items').insert({
        item_id: endItem.id,
        serial_number: obj.serial_number,
        user_id: userId,
        status: 'serviceable',
        cost: endItem.cost,
      }),
    ];

    await Promise.all(inserts);
  });
};

exports.insertComponent = async obj => {
  await db('components').insert({
    ui: obj.ui,
    niin: obj.niin,
    description: obj.description,
    auth_qty: obj.auth_qty || 1,
    cost: ((Math.random() * 100000000) / 100).toFixed(2),
  });
};
