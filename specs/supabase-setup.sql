-- =============================================
-- Chu_Log - Supabase DB setup
-- Execute this file in Supabase SQL Editor
-- =============================================

-- Create table
CREATE TABLE stupid_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title text NOT NULL CHECK (char_length(event_title) <= 50),
  event_description text NOT NULL CHECK (char_length(event_description) <= 1000),
  event_date date NOT NULL,
  recorder_name text NOT NULL CHECK (char_length(recorder_name) <= 50),
  source_link text,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0 CHECK (likes >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_event_title ON stupid_events(event_title);
CREATE INDEX idx_event_date ON stupid_events(event_date DESC);
CREATE INDEX idx_created_at ON stupid_events(created_at DESC);

-- Create increment likes function
CREATE OR REPLACE FUNCTION increment_likes(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stupid_events
  SET likes = likes + 1,
      updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create statistics function
CREATE OR REPLACE FUNCTION get_event_stats()
RETURNS TABLE (
  event_title text,
  event_count bigint,
  total_likes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.event_title,
    COUNT(*) as event_count,
    SUM(se.likes) as total_likes
  FROM stupid_events se
  GROUP BY se.event_title
  ORDER BY event_count DESC, total_likes DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE stupid_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow read access for all users
CREATE POLICY "Enable read access for all users"
ON stupid_events FOR SELECT
USING (true);

-- RLS Policy: Allow insert access for all users
CREATE POLICY "Enable insert access for all users"
ON stupid_events FOR INSERT
WITH CHECK (true);

-- RLS Policy: Allow update access for all users (for likes)
CREATE POLICY "Enable update for all users"
ON stupid_events FOR UPDATE
USING (true);

-- =============================================
-- After setup, go to Supabase Dashboard:
-- Database > Replication > Enable Realtime for stupid_events
-- =============================================
