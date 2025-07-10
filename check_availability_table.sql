
-- Check if the table and column exist and preview data
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'availability';

-- Show sample rows to match date and start_time values
SELECT *
FROM availability
WHERE status IS NOT NULL
LIMIT 10;
