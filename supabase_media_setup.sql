-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add media columns and ensure proper TIMESTAMPTZ timezone handling
ALTER TABLE scheduled_threads 
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'TEXT',
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}',
  ALTER COLUMN scheduled_at TYPE TIMESTAMPTZ USING scheduled_at AT TIME ZONE 'UTC';

-- Index for efficient cron querying
CREATE INDEX IF NOT EXISTS idx_scheduled_threads_status_time 
  ON scheduled_threads (status, scheduled_at);

-- Create public storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('threads-media', 'threads-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
CREATE POLICY "Public Read Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'threads-media');

CREATE POLICY "Authenticated Upload Access" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'threads-media');
