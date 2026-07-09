
-- 1) Storage: scope SELECT to known path prefixes
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'project-images'
  AND (
    (storage.foldername(name))[1] IN ('projets', 'profil')
  )
);

-- 2) Storage: scope admin write policies to the same prefixes
DROP POLICY IF EXISTS "Admin peut uploader des images" ON storage.objects;
CREATE POLICY "Admin peut uploader des images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil')
);

DROP POLICY IF EXISTS "Admin peut modifier des images" ON storage.objects;
CREATE POLICY "Admin peut modifier des images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil')
)
WITH CHECK (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil')
);

DROP POLICY IF EXISTS "Admin peut supprimer des images" ON storage.objects;
CREATE POLICY "Admin peut supprimer des images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil')
);

-- 3) has_role: restrict EXECUTE. Revoke from PUBLIC/anon; keep for authenticated
--    (required so RLS policies calling has_role continue to work) and service_role.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
