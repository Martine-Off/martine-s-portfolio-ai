
-- Ajout du champ project_date sur la table projects.
-- Permet de spécifier une date ou période (ex: "2024", "2023-2024", "Mars 2024").
-- Type TEXT utilisé pour une flexibilité maximale dans un contexte portfolio.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_date TEXT;
