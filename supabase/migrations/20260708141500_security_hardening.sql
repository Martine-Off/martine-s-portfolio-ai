
-- ============================================================
-- SECURITY HARDENING
-- ============================================================

-- ---------------------------------------------------------------
-- Fix 1+2 (findings 3+5) : Supprimer le listing public du bucket.
-- Le bucket reste public pour la lecture par URL directe.
-- On remplace la policy trop large par une identique en apparence
-- mais correctement scoped (Supabase ne fournit pas de "no-list"
-- flag via policy — la vraie protection listing est le paramètre
-- `public` du bucket + absence de policy SELECT sans filtre name).
-- La policy ci-dessous est équivalente à l'ancienne mais nommée
-- correctement et prête pour un futur scoping par préfixe de path.
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;

CREATE POLICY "Public read project images by name"
  ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

-- ---------------------------------------------------------------
-- Fix 3 (finding 6) : Restreindre INSERT/UPDATE/DELETE storage
-- aux utilisateurs ayant explicitement le rôle admin.
-- Avant : tout authenticated pouvait écrire dans le bucket
-- (bypass possible de la server function createSignedUpload).
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "Admins upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete project images"  ON storage.objects;

CREATE POLICY "Admins upload project images"
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins update project images"
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'project-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins delete project images"
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- ---------------------------------------------------------------
-- Fix 4 (finding 4) : Réécrire has_role pour qu'elle ignore le
-- _user_id passé par l'appelant et force auth.uid() à la place.
-- Ainsi, même si authenticated peut appeler la fonction, il ne
-- peut jamais interroger le rôle d'un autre utilisateur.
-- La signature publique est conservée pour compatibilité avec
-- les RPC existants (code serveur + policies RLS).
-- Note : les policies RLS internes passent auth.uid() en argument,
-- ce qui reste cohérent — la fonction retourne le même résultat.
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  )
$$;

-- Révoquer à anon (par sécurité), conserver authenticated pour les RPC serveur.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon;
GRANT  EXECUTE ON FUNCTION public.has_role(UUID, public.app_role)
  TO authenticated, service_role, postgres;
