CREATE TABLE IF NOT EXISTS tiny_thoughts (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (
    category IN (
      'lesson',
      'observation',
      'funny',
      'opinion',
      'arcade',
      'music',
      'cat',
      'twin-peaks',
      'other'
    )
  ),
  content TEXT NOT NULL,
  image_url TEXT,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  inspired_by_category TEXT NOT NULL DEFAULT 'other' CHECK (
    inspired_by_category IN (
      'article-link',
      'song',
      'video',
      'conversation',
      'other'
    )
  ),
  inspired_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tiny_thoughts_created_at_idx
ON tiny_thoughts (created_at DESC);
