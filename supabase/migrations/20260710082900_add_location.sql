-- Add location field to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS location text;
