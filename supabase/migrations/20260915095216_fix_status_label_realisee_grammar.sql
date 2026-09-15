-- Correctif grammatical : "Réalisée" -> "Réalisé" (invariable, accordé avec "le statut")
-- Aucune autre valeur de status_label n'est modifiée.

-- 1. Vérification préalable : valeurs actuelles et leur nombre
SELECT status_label, COUNT(*) AS nb
FROM public.projects
GROUP BY status_label
ORDER BY status_label;

-- 2. Correction (le nombre de lignes affectées doit correspondre au nombre
--    retourné pour "Réalisée" à l'étape 1)
UPDATE public.projects
SET status_label = 'Réalisé'
WHERE status_label = 'Réalisée';

-- 3. Vérification post-migration : "Réalisée" ne doit plus apparaître,
--    "À venir", "POC", "MVP", "En production" doivent être inchangés
SELECT status_label, COUNT(*) AS nb
FROM public.projects
GROUP BY status_label
ORDER BY status_label;
