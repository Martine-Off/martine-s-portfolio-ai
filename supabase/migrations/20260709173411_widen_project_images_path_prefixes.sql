
-- Fix regression from 20260709093835: the app uploads images under several
-- path prefixes ('covers', 'blocks', 'site', 'uploads') that were not in the
-- allow-list, causing "new row violates row-level security policy" on upload.
-- Widen the allow-list to match every prefix actually used by ImageUpload.tsx.

DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'project-images'
  AND (
    (storage.foldername(name))[1] IN ('projets', 'profil', 'covers', 'blocks', 'site', 'uploads')
  )
);

DROP POLICY IF EXISTS "Admin peut uploader des images" ON storage.objects;
CREATE POLICY "Admin peut uploader des images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil', 'covers', 'blocks', 'site', 'uploads')
);

DROP POLICY IF EXISTS "Admin peut modifier des images" ON storage.objects;
CREATE POLICY "Admin peut modifier des images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil', 'covers', 'blocks', 'site', 'uploads')
)
WITH CHECK (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil', 'covers', 'blocks', 'site', 'uploads')
);

DROP POLICY IF EXISTS "Admin peut supprimer des images" ON storage.objects;
CREATE POLICY "Admin peut supprimer des images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND (storage.foldername(name))[1] IN ('projets', 'profil', 'covers', 'blocks', 'site', 'uploads')
);
