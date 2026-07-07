
DROP INDEX IF EXISTS public.one_profil_only;
DROP INDEX IF EXISTS public.projects_type_idx;

ALTER TYPE public.project_type RENAME TO project_type_old;
CREATE TYPE public.project_type AS ENUM ('poc_perso', 'production_client', 'poc_ecole', 'formation_mission', 'profil');

ALTER TABLE public.projects
  ALTER COLUMN project_type TYPE public.project_type
  USING (
    CASE project_type::text
      WHEN 'formation_donnees' THEN 'formation_mission'::public.project_type
      WHEN 'mission_courte' THEN 'formation_mission'::public.project_type
      ELSE project_type::text::public.project_type
    END
  );

DROP TYPE public.project_type_old;

CREATE UNIQUE INDEX one_profil_only ON public.projects (project_type) WHERE (project_type = 'profil'::public.project_type);
CREATE INDEX projects_type_idx ON public.projects (project_type);

ALTER TABLE public.projects
  ADD COLUMN mission_type text,
  ADD COLUMN repo_url text,
  ADD COLUMN repo_note text,
  ADD COLUMN photo_profil_url text,
  ADD COLUMN photo_profil_alt_text text;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_mission_type_check
  CHECK (mission_type IS NULL OR mission_type IN ('formation', 'mission', 'benevolat'));

ALTER TABLE public.projects
  ADD CONSTRAINT projects_mission_type_scope_check
  CHECK (
    (project_type = 'formation_mission' AND mission_type IS NOT NULL)
    OR (project_type <> 'formation_mission' AND mission_type IS NULL)
  );

ALTER TABLE public.projects DROP COLUMN external_url;

ALTER TABLE public.site_settings
  ADD COLUMN benevolat_section_title text NOT NULL DEFAULT 'Bénévolat';

ALTER TABLE public.site_settings
  DROP COLUMN profile_photo_url,
  DROP COLUMN profile_photo_alt_text,
  DROP COLUMN bahut_url;
