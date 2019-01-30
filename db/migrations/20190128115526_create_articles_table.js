exports.up = function (connection, Promise) {
  return connection.schema.createTable('articles', (articles_table) => {
    articles_table.increments('article_id').primary();
    articles_table.string('title').notNullable();
    articles_table.text('body').notNullable();
    articles_table
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    articles_table
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articles_table
      .string('username')
      .references('users.username')
      .notNullable();
    articles_table.timestamp('created_at').defaultTo(connection.fn.now());
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('articles');
};
