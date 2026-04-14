exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.varchar('username', 50).unique().notNullable();
    table.string('password').notNullable();
    table.string('name_first', 50).notNullable();
    table.string('name_last', 50).notNullable();
    table.varchar('email', 50).unique()
    table.text('note');
    table.varchar('phone');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.bigInteger('dodid').unique();
    table.string('role')
    table.integer('rank_id').unsigned();
    table.integer('uic_id').unsigned();
    table
      .foreign('rank_id')
      .references('id')
      .inTable('ranks')
      .onDelete("CASCADE")
    table
      .foreign('uic_id')
      .references('id')
      .inTable('uics')
      .onDelete("CASCADE")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};