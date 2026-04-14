exports.up = function (knex) {
  return knex.schema.createTable('history_component_archive', table => {
    table.increments('id');
    table.boolean('seen');
    table.text('location');
    table.timestamp('last_seen');
    table.timestamp('archived_at').defaultTo(knex.fn.now()).notNullable();
    table.text('note');
    table.integer('user_id').unsigned();
    table.integer('component_id').unsigned();
    table.integer('serial_number').unsigned();
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('component_id')
      .references('id')
      .inTable('components')
      .onDelete('CASCADE');
    table
      .foreign('serial_number')
      .references('id')
      .inTable('serial_component_items')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('history_component_archive');
};
