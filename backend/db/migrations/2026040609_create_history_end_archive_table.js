exports.up = function (knex) {
  return knex.schema.createTable('history_end_archive', table => {
    table.increments('id');
    table.boolean('seen');
    table.text('location');
    table.timestamp('last_seen');
    table.timestamp('archived_at').defaultTo(knex.fn.now()).notNullable();
    table.integer('user_id').unsigned();
    table.integer('end_item_id').unsigned();
    table.integer('serial_number').unsigned();
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('end_item_id')
      .references('id')
      .inTable('end_items')
      .onDelete('CASCADE');
    table
      .foreign('serial_number')
      .references('id')
      .inTable('serial_end_items')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('history_end_archive');
};
