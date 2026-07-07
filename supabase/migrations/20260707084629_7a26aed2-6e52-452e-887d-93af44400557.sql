
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Admins upload project images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Admins update project images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Admins delete project images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');
