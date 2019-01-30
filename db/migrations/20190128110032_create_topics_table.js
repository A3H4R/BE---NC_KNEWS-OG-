exports.up = function (connection, Promise) {
  return connection.schema.createTable('topics', (topics_table) => {
    topics_table.string('slug').primary();
    topics_table.string('description').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('topics');
};
