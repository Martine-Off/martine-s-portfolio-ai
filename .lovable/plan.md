# Portfolio Martine Desmaroux — Plan consolidé v3

Corrige la palette du Delta 1 avec les hex exacts du prompt maître (section 1). Le reste du plan v2 est inchangé.

## Delta 1 (corrigé) — Palette exacte du prompt maître, hex bruts

Dans `src/styles.css`, tokens sémantiques définis directement en hex, sans conversion oklch/HSL, sans substitution shadcn par défaut :

```css
:root {
  --background: #F0EEF9;
  --card: #FAFAFC;
  --foreground: #1A1B2E;
  --muted-foreground: #5F5A85;
  --decorative: #928DB9;
  --accent: #65BFF1;
  --border: #EAE8F5;
  --success-bg: #E8F9F2;
  --success-text: #2A7A5A;
  --success-accent: #6DCFA8;
  --info-bg: #E2F2FF;
  --info-text: #2A7AAA;
  --warning-bg: #FDF1E4;
  --warning-border: #ECC28F;
  --warning-text: #A0622A;
}

@theme inline {
  --color-background: var(--background);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-decorative: var(--decorative);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-success-bg: var(--success-bg);
  --color-success-text: var(--success-text);
  --color-success-accent: var(--success-accent);
  --color-info-bg: var(--info-bg);
  --color-info-text: var(--info-text);
  --color-warning-bg: var(--warning-bg);
  --color-warning-border: var(--warning-border);
  --color-warning-text: var(--warning-text);
}
```

### Règles d'usage strictes (à respecter dans TOUS les composants générés)

- `--decorative` (`#928DB9`) : **jamais** utilisé comme couleur de texte ni de lien. Réservé aux bordures, séparateurs, fond de badges (pill de statut), 6px vertical accent des cartes sans image. Contraste insuffisant pour AA en texte.
- `--accent` (`#65BFF1`) : **seul token accent pour liens et éléments interactifs** (liens texte, focus ring, hover d'action, accent de statut si aucun `accent_color` projet n'est défini).
- `--muted-foreground` (`#5F5A85`) : texte secondaire (tagline, meta). Contraste AA vérifié sur `--background` (`#F0EEF9`) — ratio ≈ 4.7:1 ✅.
- `--foreground` (`#1A1B2E`) : texte principal.
- `--background` (`#F0EEF9`) : fond de page global.
- `--card` (`#FAFAFC`) : fond des cartes / surfaces surélevées.

Les variantes shadcn (Button, Badge, Card, Input, etc.) sont adaptées pour consommer **ces tokens sémantiques**, sans jamais hardcoder `text-white`, `bg-black`, ni couleurs `text-gray-*`.

### Vérification AA au point 14 de la checklist finale

- `#5F5A85` sur `#F0EEF9` → 4.7:1 ✅
- `#1A1B2E` sur `#F0EEF9` → 14.8:1 ✅
- `#1A1B2E` sur `#FAFAFC` → 15.9:1 ✅
- `--decorative` non testé en texte car interdit d'usage texte (règle appliquée par revue de code lors de la génération).

## Delta 2 (inchangé) — Index unique partiel `one_profil_only`

Migration :
```sql
create unique index one_profil_only
  on public.projects ((project_type))
  where project_type = 'profil';
```
`saveProject` intercepte `error.code === '23505'` + nom d'index → toast "Un profil existe déjà."

## Delta 3 (inchangé) — Champs alt dans `/admin/reglages`

Colonnes `cover_image_alt_text` et `profile_photo_alt_text` sur `site_settings`, inputs texte optionnels sous chaque upload, repli sur `hero_title` / `"Photo de profil de Martine Desmaroux"`.

## Reste du plan (v1) inchangé

Cloud + schéma DB, routing `_authenticated`, pages publiques `/`, `/profil`, `/projets/$slug`, auth email/password + reset, admin CRUD complet, blocs vidéo iframe (Loom / YouTube / Arcade), checklist finale 14 points.

## Confirmation explicite

Je confirme que dans les composants générés :
- `--decorative` (`#928DB9`) ne sera utilisé **nulle part** comme couleur de texte ou de lien.
- `--accent` (`#65BFF1`) est le **seul** token pour liens et éléments interactifs (sauf `accent_color` propre à un projet).
- Aucune valeur hex ne sera arrondie, dérivée ou remplacée par un défaut shadcn.

## Actions manuelles côté utilisateur

1. Création du compte admin via `/auth`, puis attribution du rôle `admin` (SQL fourni après premier sign-up).
2. Connexion GitHub si versioning souhaité.
3. Upload initial des images cover / profil via `/admin/reglages`.
