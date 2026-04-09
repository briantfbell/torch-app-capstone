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
<<<<<<< HEAD
    const [[endItem]] = await Promise.all([
=======
    const [existingUic, [endItem]] = await Promise.all([
      trx('uics').where({ uic: obj.uic }).select('id').first(),
>>>>>>> ced7a272030c98e8072dc65ff6c9215310b33896
      trx('end_items')
        .insert({
          lin: obj.lin,
          fsc: obj.fsc,
          niin: obj.niin,
          description: obj.description,
          auth_qty: obj.auth_qty || 1,
<<<<<<< HEAD
          cost: ((Math.random() * 100000000) / 100).toFixed(2),
=======
          cost: `$${((Math.random() * 100000000) / 100).toFixed(2)}`,
>>>>>>> ced7a272030c98e8072dc65ff6c9215310b33896
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

<<<<<<< HEAD
=======
    if (!existingUic) {
      inserts.push(trx('uics').insert({ uic: obj.uic }));
    }

>>>>>>> ced7a272030c98e8072dc65ff6c9215310b33896
    await Promise.all(inserts);
  });
};

exports.insertComponent = async obj => {
  await db('components').insert({
    ui: obj.ui,
    niin: obj.niin,
    description: obj.description,
    auth_qty: obj.auth_qty || 1,
<<<<<<< HEAD
    cost: ((Math.random() * 100000000) / 100).toFixed(2),
=======
    cost: `$${Math.round(Math.random() * 100000000)}`,
>>>>>>> ced7a272030c98e8072dc65ff6c9215310b33896
  });
};
