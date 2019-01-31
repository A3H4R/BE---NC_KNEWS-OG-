exports.up = function (connection, Promise) {
  return connection.schema.createTable('comments', (comments_table) => {
    comments_table.increments('comment_id').primary().notNullable();
    comments_table
      .string('username')
      .references('users.username')
      .notNullable();
    comments_table.integer('article_id').references('articles.article_id');
    comments_table
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    comments_table.timestamp('created_at').defaultTo(connection.fn.now());
    comments_table.text('body').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('comments');
};
