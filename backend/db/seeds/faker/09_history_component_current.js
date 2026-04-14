const createComponents = async (num, items, user) => {
  let temp = [];

  const item_id = items.map(row => row.id);
  const user_id = user.map(row => row.id);

  for (let i = 0; i < num; i++) {
    temp.push({
      user_id: user_id[0],
      component_id: item_id[0],
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  await knex('history_component_current').del();

  await knex.raw(
    'ALTER SEQUENCE history_component_current_id_seq RESTART WITH 1',
  );

  const items = await knex('components').select('id');
  const user = await knex('users').select('id');

  await knex('history_component_current').insert([
    ...(await createComponents(1, items, user)),
  ]);
};
