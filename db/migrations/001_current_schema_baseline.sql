CREATE TABLE IF NOT EXISTS site_projects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'paused', 'planning', 'shipped', 'archived')
  ),
  phase TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT 'None',
  blockers TEXT NOT NULL DEFAULT '',
  priority INTEGER NOT NULL DEFAULT 3,
  last_updated_at DATE,
  include_in_context_refresh BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
ALTER TABLE site_projects
ADD COLUMN IF NOT EXISTS include_in_context_refresh BOOLEAN NOT NULL DEFAULT true

-- statement-breakpoint
ALTER TABLE site_projects
ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT ''

-- statement-breakpoint
ALTER TABLE site_projects
ALTER COLUMN next_action SET DEFAULT 'None'

-- statement-breakpoint
ALTER TABLE site_projects
ALTER COLUMN priority SET DEFAULT 3

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS site_projects_display_order_idx
ON site_projects (display_order ASC)

-- statement-breakpoint
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
)

-- statement-breakpoint
ALTER TABLE tiny_thoughts
ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb

-- statement-breakpoint
ALTER TABLE tiny_thoughts
ADD COLUMN IF NOT EXISTS inspired_by_category TEXT NOT NULL DEFAULT 'other'

-- statement-breakpoint
ALTER TABLE tiny_thoughts
ADD COLUMN IF NOT EXISTS inspired_by TEXT NOT NULL DEFAULT ''

-- statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tiny_thoughts_inspired_by_category_check'
      AND conrelid = 'tiny_thoughts'::regclass
  ) THEN
    ALTER TABLE tiny_thoughts
    ADD CONSTRAINT tiny_thoughts_inspired_by_category_check
    CHECK (
      inspired_by_category IN (
        'article-link',
        'song',
        'video',
        'conversation',
        'other'
      )
    );
  END IF;
END
$$

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS tiny_thoughts_created_at_idx
ON tiny_thoughts (created_at DESC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS home_spotlight (
  id TEXT PRIMARY KEY,
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link_label TEXT NOT NULL,
  link_href TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS home_spotlight_queue (
  id TEXT PRIMARY KEY,
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link_label TEXT NOT NULL,
  link_href TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS home_spotlight_queue_display_order_idx
ON home_spotlight_queue (display_order ASC, updated_at DESC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS context_refresh_exports (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  variant TEXT NOT NULL CHECK (
    variant IN ('concise', 'full', 'project', 'dating-social', 'dev-technical')
  ),
  redacted BOOLEAN NOT NULL DEFAULT true,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS context_refresh_exports_updated_at_idx
ON context_refresh_exports (updated_at DESC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS context_refresh_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  preferred_name TEXT NOT NULL,
  region TEXT NOT NULL,
  site_name TEXT NOT NULL,
  github_repo TEXT NOT NULL,
  identity_summary TEXT NOT NULL,
  memory_core TEXT NOT NULL DEFAULT '',
  long_term_goals TEXT NOT NULL DEFAULT '',
  current_priorities TEXT NOT NULL DEFAULT '',
  active_social_context TEXT NOT NULL DEFAULT '',
  creative_themes TEXT NOT NULL DEFAULT '',
  conversation_preferences TEXT NOT NULL DEFAULT '',
  additional_context TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS social_quest_log_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  quest_type TEXT NOT NULL CHECK (
    quest_type IN (
      'singles-event',
      'discord-group',
      'meetup',
      'class-workshop',
      'friend-hang',
      'solo-outing',
      'other'
    )
  ),
  event_name TEXT NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 140),
  location TEXT NOT NULL DEFAULT '',
  occurred_on DATE NOT NULL,
  people_met_count INTEGER NOT NULL DEFAULT 0 CHECK (people_met_count BETWEEN 0 AND 99),
  conversations_count INTEGER NOT NULL DEFAULT 0 CHECK (conversations_count BETWEEN 0 AND 99),
  confidence_before INTEGER NOT NULL DEFAULT 3 CHECK (confidence_before BETWEEN 1 AND 5),
  confidence_after INTEGER NOT NULL DEFAULT 3 CHECK (confidence_after BETWEEN 1 AND 5),
  conversation_notes TEXT NOT NULL DEFAULT '',
  follow_up_ideas TEXT NOT NULL DEFAULT '',
  what_i_learned TEXT NOT NULL DEFAULT '',
  next_experiment TEXT NOT NULL DEFAULT '',
  victory_note TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS social_quest_log_entries_occurred_on_idx
ON social_quest_log_entries (occurred_on DESC, created_at DESC)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS social_quest_log_entries_quest_type_idx
ON social_quest_log_entries (quest_type)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS social_quest_log_entries_created_at_idx
ON social_quest_log_entries (created_at DESC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS site_now_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS site_now_items_display_order_idx
ON site_now_items (display_order ASC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS content_inbox_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'chatgpt' CHECK (
    source IN ('chatgpt', 'life-note', 'project-note', 'web-link', 'other')
  ),
  bucket TEXT NOT NULL DEFAULT 'not-sure' CHECK (
    bucket IN ('good-line', 'site-idea', 'tiny-thought', 'essay', 'project-update', 'not-sure')
  ),
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'inbox' CHECK (
    status IN ('inbox', 'drafted', 'archived')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_inbox_items_status_created_at_idx
ON content_inbox_items (status ASC, created_at DESC)

-- statement-breakpoint
CREATE TABLE IF NOT EXISTS writing_drafts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'shaping', 'ready', 'archived')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)

-- statement-breakpoint
CREATE INDEX IF NOT EXISTS writing_drafts_status_updated_at_idx
ON writing_drafts (status ASC, updated_at DESC)
