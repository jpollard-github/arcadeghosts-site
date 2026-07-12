DROP TABLE IF EXISTS home_spotlight;
-- statement-breakpoint
DROP TABLE IF EXISTS home_spotlight_queue;
-- statement-breakpoint
DROP TABLE IF EXISTS context_refresh_exports;
-- statement-breakpoint
DROP TABLE IF EXISTS context_refresh_profiles;
-- statement-breakpoint
DROP TABLE IF EXISTS social_quest_log_entries;
-- statement-breakpoint
DROP TABLE IF EXISTS site_now_items;
-- statement-breakpoint
DROP TABLE IF EXISTS content_inbox_items;
-- statement-breakpoint
DROP TABLE IF EXISTS writing_drafts;
-- statement-breakpoint
ALTER TABLE site_projects
DROP COLUMN IF EXISTS include_in_context_refresh;
