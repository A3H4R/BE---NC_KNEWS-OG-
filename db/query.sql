\c nc_knews_test
select * from topics;


select * from articles where topic = 'mitch' ;


select * from articles where topic = 'mitch' ORDER BY article_id asc LIMIT 10 OFFSET 4;

-- a total_count property, displaying the total number of articles for the given topic