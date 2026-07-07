
-- Add new block types
ALTER TYPE public.block_type ADD VALUE IF NOT EXISTS 'liste';
ALTER TYPE public.block_type ADD VALUE IF NOT EXISTS 'comparatif';

-- Allow accent_color to be null (so we can distinguish "user set" vs "auto-derive")
ALTER TABLE public.projects ALTER COLUMN accent_color DROP DEFAULT;
ALTER TABLE public.projects ALTER COLUMN accent_color DROP NOT NULL;
