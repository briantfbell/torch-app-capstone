exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('ranks').del();

  await knex.raw('ALTER SEQUENCE ranks_id_seq RESTART WITH 1');

  await knex('ranks').insert([
    { rank: 'E-1' },
    { rank: 'E-2' },
    { rank: 'E-3' },
    { rank: 'E-4' },
    { rank: 'E-5' },
    { rank: 'E-6' },
    { rank: 'E-7' },
    { rank: 'E-8' },
    { rank: 'E-9' },

    { rank: 'W-1' },
    { rank: 'W-2' },
    { rank: 'W-3' },
    { rank: 'W-4' },
    { rank: 'W-5' },

    { rank: 'O-1' },
    { rank: 'O-2' },
    { rank: 'O-3' },
    { rank: 'O-4' },
    { rank: 'O-5' },
    { rank: 'O-6' },
    { rank: 'O-7' },
    { rank: 'O-8' },
    { rank: 'O-9' },
    { rank: 'O-10' },

    { rank: 'GS-1' },
    { rank: 'GS-2' },
    { rank: 'GS-3' },
    { rank: 'GS-4' },
    { rank: 'GS-5' },
    { rank: 'GS-6' },
    { rank: 'GS-7' },
    { rank: 'GS-8' },
    { rank: 'GS-9' },
    { rank: 'GS-10' },
    { rank: 'GS-11' },
    { rank: 'GS-12' },
    { rank: 'GS-13' },
    { rank: 'GS-14' },
    { rank: 'GS-15' },

    { rank: 'SES' },

    { rank: 'WG-1' },
    { rank: 'WG-2' },
    { rank: 'WG-3' },
    { rank: 'WG-4' },
    { rank: 'WG-5' },
    { rank: 'WG-6' },
    { rank: 'WG-7' },
    { rank: 'WG-8' },
    { rank: 'WG-9' },
    { rank: 'WG-10' },
    { rank: 'WG-11' },
    { rank: 'WG-12' },
    { rank: 'WG-13' },
    { rank: 'WG-14' },
    { rank: 'WG-15' },
  ]);
};
