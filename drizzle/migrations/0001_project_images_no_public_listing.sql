DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Admin peut lister les images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));