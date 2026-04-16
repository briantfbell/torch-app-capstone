const db = require('../../db/knex');
const endItemsModels = require('../models/endItemsModels');

exports.insertSerializedItem = async (obj, userId, uicId) => {
  const duplicates = [];

  const match = await db('serial_end_items')
    .where({ serial_number: obj.serial_number })
    .select('serial_number')
    .first();

  if (match) {
    duplicates.push(match);
    return;
  }

  await db.transaction(async trx => {
    let endItem = await trx('end_items')
      .where({ fsc: obj.fsc, niin: obj.niin, lin: obj.lin })
      .select('id', 'cost')
      .first();

    if (!endItem) {
      [endItem] = await trx('end_items')
        .insert({
          lin: obj.lin,
          fsc: obj.fsc,
          niin: obj.niin,
          description: obj.description,
          auth_qty: obj.auth_qty || 1,
          cost: obj.cost,
          image: obj.image,
        })
        .returning(['id', 'cost']);
    }

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

  if (!end_item) {
    const error = new Error(
      `No end item exists for LIN: ${obj.end_item_lin}.\nUpload associated end item first.`,
    );
    error.status = 400;
    throw error;
  }

  await db.transaction(async trx => {
    const duplicates = [];

    // Files need to be updated with unique NIINs
    // let component = await trx('components')
    //   .where({ niin: obj.niin })
    //   .select('id', 'cost')
    //   .first();

    // if (!component) {
    const [component] = await trx('components')
      .insert({
        niin: obj.niin,
        description: obj.description,
        ui: obj.ui,
        auth_qty: obj.auth_qty || 1,
        end_item_id: end_item.id,
        cost: obj.cost,
      })
      .returning(['id', 'cost']);
    // }

    if (obj.serial_number) {
      const match = await db('serial_component_items')
        .where({ serial_number: obj.serial_number })
        .select('serial_number')
        .first();

      if (match) {
        duplicates.push(match);
        return;
      }

      await trx('serial_component_items').insert({
        component_id: component.id,
        serial_number: obj.serial_number,
        user_id: userId,
        uic_id: uicId ?? null,
        status: 'serviceable',
      });
    }

    if (duplicates.length > 0) {
      const error = new Error(
        `The following SNs are assigned to another UIC:\n${duplicates}`,
      );
      error.status = 400;
      throw error;
    }
  });
};
