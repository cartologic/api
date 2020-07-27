
exports.up = function(knex, Promise) {
    return knex.schema.table('projects', table => {
      table.string('type').defaultTo('international').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', table => {
      table.dropColumn('type');
    });
};
