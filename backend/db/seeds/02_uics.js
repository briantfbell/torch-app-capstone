exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('uics').del()

  await knex.raw("ALTER SEQUENCE uics_id_seq RESTART WITH 1")

  await knex('uics').insert([
    {uic: 'WCAEB1', unit_name: '1st PSYOP'},
    {uic: 'WDSLC0', unit_name: '1SFG(A), TISC'},
    {uic: 'WJQ1D0', unit_name: '1SFG(A), MDSOC'},
  ]);
};