exports.up = function (connection, Promise) {
  return connection.schema.createTable('users', (users_table) => {
    users_table.string('username').primary();
    users_table.string('avatar_url').notNullable();
    users_table.string('name').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('users');
};
