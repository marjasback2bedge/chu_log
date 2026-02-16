-- =============================================
-- 朋友白癡事件記錄平台 - Supabase 資料庫設定
-- 在 Supabase SQL Editor 中執行此檔案
-- =============================================

-- 建立資料表
CREATE TABLE stupid_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL CHECK (char_length(person_name) <= 50),
  event_description text NOT NULL CHECK (char_length(event_description) <= 1000),
  event_date date NOT NULL,
  recorder_name text NOT NULL CHECK (char_length(recorder_name) <= 50),
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0 CHECK (likes >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 建立索引
CREATE INDEX idx_person_name ON stupid_events(person_name);
CREATE INDEX idx_event_date ON stupid_events(event_date DESC);
CREATE INDEX idx_created_at ON stupid_events(created_at DESC);

-- 建立點讚函數
CREATE OR REPLACE FUNCTION increment_likes(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stupid_events
  SET likes = likes + 1,
      updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立統計函數
CREATE OR REPLACE FUNCTION get_event_stats()
RETURNS TABLE (
  person_name text,
  event_count bigint,
  total_likes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.person_name,
    COUNT(*) as event_count,
    SUM(se.likes) as total_likes
  FROM stupid_events se
  GROUP BY se.person_name
  ORDER BY event_count DESC, total_likes DESC;
END;
$$ LANGUAGE plpgsql;

-- 啟用 RLS
ALTER TABLE stupid_events ENABLE ROW LEVEL SECURITY;

-- RLS 政策：允許所有人讀取
CREATE POLICY "Enable read access for all users"
ON stupid_events FOR SELECT
USING (true);

-- RLS 政策：允許所有人新增
CREATE POLICY "Enable insert access for all users"
ON stupid_events FOR INSERT
WITH CHECK (true);

-- RLS 政策：允許所有人更新（用於點讚）
CREATE POLICY "Enable update for all users"
ON stupid_events FOR UPDATE
USING (true);

-- =============================================
-- 設定完成後，請到 Supabase Dashboard：
-- Database > Replication > 啟用 stupid_events 的 Realtime
-- =============================================
