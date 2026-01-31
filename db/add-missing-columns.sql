-- Run this in your Supabase SQL Editor to add missing columns
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor -> New Query

-- Add job_description column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resumes' AND column_name = 'job_description') THEN
        ALTER TABLE resumes ADD COLUMN job_description text;
    END IF;
END $$;

-- Add ats_score column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resumes' AND column_name = 'ats_score') THEN
        ALTER TABLE resumes ADD COLUMN ats_score integer;
    END IF;
END $$;

-- Add jd_match_score column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resumes' AND column_name = 'jd_match_score') THEN
        ALTER TABLE resumes ADD COLUMN jd_match_score integer;
    END IF;
END $$;

-- Add is_ai_generated column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resumes' AND column_name = 'is_ai_generated') THEN
        ALTER TABLE resumes ADD COLUMN is_ai_generated boolean DEFAULT false;
    END IF;
END $$;

-- Add version column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resumes' AND column_name = 'version') THEN
        ALTER TABLE resumes ADD COLUMN version integer DEFAULT 1;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resumes'
ORDER BY ordinal_position;
