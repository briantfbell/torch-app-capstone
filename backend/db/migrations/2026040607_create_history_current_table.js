exports.up = function (knex) {
  return knex.schema.createTable('history_current', table => {
    table.increments('id');
    table.boolean('seen').defaultTo(false).notNullable();
    table.text('location');
    table.timestamp('last_seen');
    table.integer('count_current');
    table.integer('user_id').unsigned();
    table.integer('end_item_id').unsigned();
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
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('history_current');
};
