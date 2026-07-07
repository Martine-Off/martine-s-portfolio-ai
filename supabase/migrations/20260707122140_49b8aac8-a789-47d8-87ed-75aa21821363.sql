
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_mission_type_scope_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_mission_type_scope_check
  CHECK (
    project_type = 'formation_mission' OR mission_type IS NULL
  );
