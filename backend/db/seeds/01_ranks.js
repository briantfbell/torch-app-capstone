exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ranks').del()

  await knex.raw("ALTER SEQUENCE ranks_id_seq RESTART WITH 1")

  await knex('ranks').insert([
    {rank: 'E-1'},
    {rank: 'E-2'},
    {rank: 'E-3'},
    {rank: 'E-4'},
    {rank: 'E-5'},
    {rank: 'E-6'},
    {rank: 'E-7'},
    {rank: 'E-8'},
    {rank: 'E-9'},
    {rank: 'W-1'},
    {rank: 'W-2'},
    {rank: 'W-3'},
    {rank: 'W-4'},
    {rank: 'W-5'},
    {rank: 'O-1'},
    {rank: 'O-2'},
    {rank: 'O-3'},
    {rank: 'O-4'},
    {rank: 'O-5'},
    {rank: 'O-6'},
    {rank: 'O-7'},
    {rank: 'O-8'},
    {rank: 'O-9'},
    {rank: 'O-10'}
  ]);
};