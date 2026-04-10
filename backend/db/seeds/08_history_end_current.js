
const createComponents = async (num, items, user, sn) => {
  let temp = [];

  const item_id = items.map(row => row.id)
  const user_id = user.map(row => row.id)
  const serial_number = sn.map(row => row.id)

  for (let i = 0; i < num; i++) {

    temp.push({
      user_id: user_id[0],
      end_item_id: item_id[0],
      serial_number: serial_number[0]
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  await knex('history_end_current').del();

  await knex.raw('ALTER SEQUENCE history_end_current_id_seq RESTART WITH 1');

  const items = await knex('end_items').select('id');
  const user = await knex('users').select('id');
  const sn = await knex('serial_end_items').select('id');

  await knex('history_end_current').insert([
    ...(await createComponents(1, items, user, sn)),
  ]);
};
