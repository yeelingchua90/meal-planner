-- Migration: extend weekly_drafts.day_of_week to support lunch (0-6) and dinner (7-13)
-- Run this in the Supabase SQL editor

ALTER TABLE weekly_drafts
  DROP CONSTRAINT IF EXISTS weekly_drafts_day_of_week_check;

ALTER TABLE weekly_drafts
  ADD CONSTRAINT weekly_drafts_day_of_week_check
  CHECK (day_of_week BETWEEN 0 AND 13);
