exports.up = function (knex) {
  return knex.schema.createTable('history_component_current', table => {
    table.increments('id');
    table.boolean('seen').defaultTo(false).notNullable();
    table.text('location');
    table.timestamp('last_seen');
    table.text('note');
    table.integer('count');
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
      .inTable('serial_end_items')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('history_component_current');
};
