exports.up = function (knex) {
  return knex.schema.alterTable("end_items", function (table) {
    table.boolean("completed").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("end_items", function (table) {
    table.dropColumn("completed");
  });
};
