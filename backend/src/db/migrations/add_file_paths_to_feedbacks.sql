-- Add file_paths column to feedbacks table
ALTER TABLE feedbacks 
ADD COLUMN IF NOT EXISTS file_paths TEXT[];

-- Comment on the column
COMMENT ON COLUMN feedbacks.file_paths IS 'Array of file paths for uploaded documents'; 