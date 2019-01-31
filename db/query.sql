\c nc_knews_test
    select * from topics;
    select * from users;
    select * from articles;
    select * from comments;

-- SELECT comments.article_id, COUNT(comment_id) AS comment_count
-- FROM comments 
-- LEFT JOIN articles ON articles.article_id = comments.article_id
-- GROUP BY comments.article_id;


-- SELECT articles.article_id, articles.username AS author, topic, title, articles.body, articles.votes, articles.created_at, COUNT(comments.comment_id) AS comment_count FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id
-- GROUP BY articles.article_id;

        
-- select * from articles where topic = 'mitch' ORDER BY article_id asc LIMIT 10;

-- SELECT articles.article_id, articles.username AS author, topic, title, articles.body, articles.votes, articles.created_at, COUNT (articles.article_id) AS comment_count 
-- FROM articles
-- JOIN comments ON comments.article_id = articles.article_id GROUP BY comments.article_id;

--   SELECT article_id, COUNT(article_id) AS comment_count FROM comments
--   JOIN articles ON articles.article_id = comments.article_id
--   GROUP BY article_id;

-- a total_count property, displaying the total number of articles for the given topic
-- each article should have:

--     author which is the username from the users table,
--     title
--     article_id
--     body
--     votes
--     comment_count which is the total count of all the comments with this article_id. You should make use of knex queries in order to achieve this.
--     created_at
--     topic
