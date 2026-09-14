CREATE OR REPLACE FUNCTION public.swap_project_order(_a uuid, _b uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  order_a integer;
  order_b integer;
BEGIN
  SELECT display_order INTO order_a FROM public.projects WHERE id = _a FOR UPDATE;
  SELECT display_order INTO order_b FROM public.projects WHERE id = _b FOR UPDATE;
  IF order_a IS NULL OR order_b IS NULL THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  UPDATE public.projects SET display_order = order_b WHERE id = _a;
  UPDATE public.projects SET display_order = order_a WHERE id = _b;
END;
$$;

REVOKE ALL ON FUNCTION public.swap_project_order(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.swap_project_order(uuid, uuid) TO authenticated;