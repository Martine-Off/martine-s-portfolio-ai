
-- Ajout du champ repo_label sur la table projects.
-- Permet de personnaliser le libellé du bouton de lien
-- (ex. "Voir la présentation Gamma ↗", "Voir le rapport ↗").
-- Si NULL ou vide, le rendu utilise le fallback auto :
--   github.com → "Voir le dépôt ↗"
--   autres URL → "Voir le document ↗"
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS repo_label TEXT;
