-- Remove permissive public INSERT policy on page_views
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "public insert page views" ON public.page_views;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='page_views' AND cmd='INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.page_views', p.policyname);
  END LOOP;
END $$;

-- Clients may no longer write analytics rows directly
REVOKE INSERT, UPDATE, DELETE ON public.page_views FROM anon, authenticated;
GRANT ALL ON public.page_views TO service_role;

-- Basic data validation constraints
ALTER TABLE public.page_views
  ADD CONSTRAINT page_views_path_valid CHECK (path ~ '^/' AND length(path) <= 512),
  ADD CONSTRAINT page_views_referrer_len CHECK (referrer IS NULL OR length(referrer) <= 1024),
  ADD CONSTRAINT page_views_user_agent_len CHECK (user_agent IS NULL OR length(user_agent) <= 512);