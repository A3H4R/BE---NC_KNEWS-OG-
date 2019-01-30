\c nc_knews_test
select * from topics;


select * from articles where topic = 'mitch';

select * from articles where topic = 'mitch' LIMIT 10 ORDER BY created_at;

-- a total_count property, displaying the total number of articles for the given topic