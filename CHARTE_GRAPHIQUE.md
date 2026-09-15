# 🎨 Charte Graphique — Portfolio Martine Desmaroux

> **Version** : 1.0 — Août 2026
> **Contexte** : Portfolio professionnel de Martine Desmaroux, cheffe de projet IA.
> **Stack** : TanStack Start (React SSR) · TailwindCSS 4 · Supabase · Vite
> **Fichier source** : `src/styles.css`

---

## Table des matières

1. [Philosophie du design](#1--philosophie-du-design)
2. [Palette de couleurs](#2--palette-de-couleurs)
3. [Typographie](#3--typographie)
4. [Espacements et grille](#4--espacements-et-grille)
5. [Rayons de bordure (border-radius)](#5--rayons-de-bordure)
6. [Composants UI](#6--composants-ui)
7. [Couleurs d'accent par statut de projet](#7--couleurs-daccent-par-statut-de-projet)
8. [Animations et transitions](#8--animations-et-transitions)
9. [Accessibilité (a11y)](#9--accessibilité-a11y)
10. [Iconographie](#10--iconographie)
11. [Règles d'usage strictes](#11--règles-dusage-strictes)
12. [Responsive et breakpoints](#12--responsive-et-breakpoints)
13. [SEO et métadonnées](#13--seo-et-métadonnées)

---

## 1 — Philosophie du design

Le portfolio adopte un design **minimaliste, élégant et professionnel** avec une esthétique sobre à dominante **lavande-lilas**.

**Principes directeurs :**
- **Clarté** : fond clair, contrastes vérifiés AA, hiérarchie typographique nette
- **Sobriété** : pas de dark mode, pas de couleurs criardes, palette cohérente lavande/bleu ciel
- **Professionnel** : serif pour les titres (autorité), sans-serif pour le corps (lisibilité)
- **Accessible** : tailles min. 44 px pour les zones tactiles, contraste WCAG AA vérifié
- **Responsive** : mobile-first, grille fluide max 6xl (1152 px)

---

## 2 — Palette de couleurs

> ⚠️ **ATTENTION**
> Toutes les couleurs sont définies en **hex bruts**. Ne JAMAIS convertir en oklch ou HSL.
> Les contrôles d'accessibilité AA ont été réalisés sur ces valeurs exactes.

### 2.1 — Couleurs principales

| Rôle                  | Variable CSS              | Valeur hex  | Aperçu | Usage |
|-----------------------|---------------------------|-------------|--------|-------|
| **Background**        | `--background`            | `#F0EEF9`   | 🟣 Lavande très pâle | Fond de page principal |
| **Card**              | `--card`                  | `#FAFAFC`   | ⚪ Blanc cassé | Fond des cartes, footer, nav |
| **Foreground**        | `--foreground`            | `#1A1B2E`   | 🔵 Bleu nuit | Texte principal, titres |
| **Muted**             | `--muted`                 | `#EAE8F5`   | 🟣 Lavande claire | Fonds secondaires, hover |
| **Muted foreground**  | `--muted-foreground`      | `#5F5A85`   | 🟣 Violet grisé | Texte secondaire (contraste AA ✓) |
| **Decorative**        | `--decorative`            | `#928DB9`   | 🟣 Mauve moyen | Bordures, séparateurs, badges déco |
| **Accent**            | `--accent`                | `#65BFF1`   | 🔵 Bleu ciel | Liens, éléments interactifs, hero |
| **Accent foreground** | `--accent-foreground`     | `#FFFFFF`   | ⚪ Blanc | Texte sur fond accent |
| **Border**            | `--border`                | `#EAE8F5`   | 🟣 Lavande claire | Toutes les bordures |
| **Ring**              | `--ring`                  | `#65BFF1`   | 🔵 Bleu ciel | Focus ring (accessibilité) |

### 2.2 — Rôles shadcn / UI library

| Rôle                    | Variable CSS                   | Valeur hex  | Usage |
|-------------------------|--------------------------------|-------------|-------|
| **Primary**             | `--primary`                    | `#1A1B2E`   | Boutons principaux (fond sombre) |
| **Primary foreground**  | `--primary-foreground`         | `#FAFAFC`   | Texte sur boutons primary |
| **Secondary**           | `--secondary`                  | `#EAE8F5`   | Boutons secondaires |
| **Secondary foreground**| `--secondary-foreground`       | `#1A1B2E`   | Texte sur boutons secondary |
| **Destructive**         | `--destructive`                | `#C0392B`   | Actions dangereuses |
| **Destructive foreground** | `--destructive-foreground` | `#FFFFFF`   | Texte sur destructive |

### 2.3 — Couleurs d'état (feedback)

| État        | Background     | Texte       | Accent/Bordure | Usage |
|-------------|---------------|-------------|----------------|-------|
| **Succès**  | `#E8F9F2`     | `#2A7A5A`   | `#6DCFA8`      | Confirmations, "déployé" |
| **Info**    | `#E2F2FF`     | `#2A7AAA`   | —              | Messages informatifs |
| **Warning** | `#FDF1E4`     | `#A0622A`   | `#ECC28F`      | Avertissements, "en cours" |

### 2.4 — Représentation visuelle de la palette

```
┌─────────────────────────────────────────────────────────────┐
│ FOND DE PAGE  #F0EEF9                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CARTE  #FAFAFC                                         │ │
│ │                                                         │ │
│ │  Titre #1A1B2E (Lora, serif, bold)                     │ │
│ │  Texte secondaire #5F5A85                              │ │
│ │  ─────────────── #EAE8F5 (séparateur)                  │ │
│ │  [Lien #65BFF1]    [Bouton ████ #1A1B2E]               │ │
│ │                                                         │ │
│ │  ┌──────┐  Tags : │ Tag │ │ Tag │                      │ │
│ │  │accent│  Barre latérale 6px (couleur par statut)     │ │
│ │  └──────┘                                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ FOOTER  #FAFAFC  ─── border-top #EAE8F5                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3 — Typographie

### 3.1 — Familles de polices

| Variable        | Stack complet                           | Usage |
|-----------------|----------------------------------------|-------|
| `--font-serif`  | `"Lora", Georgia, serif`               | Titres (h1, h2, h3), logo/nom dans le header |
| `--font-sans`   | `"Inter", system-ui, sans-serif`       | Corps de texte, navigation, labels, boutons |

**Chargement** : Google Fonts (preconnect + display=swap)
```
Inter  : wght 400, 500, 600, 700
Lora   : wght 400, 700 · style normal, italic
```

### 3.2 — Échelle typographique

| Élément          | Police     | Taille mobile      | Taille desktop       | Poids   | Couleur |
|------------------|-----------|---------------------|----------------------|---------|---------|
| **H1 Hero**      | Lora      | `text-2xl` (1.5rem) | `text-4xl` (2.25rem) | `bold`  | `--foreground` |
| **H1 Profil**    | Lora      | `text-3xl` (1.875rem) | `text-4xl` (2.25rem) | `bold`  | `--foreground` |
| **H2 Sections**  | Lora      | `text-xl` (1.25rem) | `text-2xl` (1.5rem)  | `bold`  | `--foreground` |
| **H3 Cartes**    | Lora      | `text-lg` (1.125rem) | `text-lg`            | `bold`  | `--foreground` |
| **H3 Sous-titre**| Lora      | `text-base` (1rem)  | `text-lg` (1.125rem) | `bold` ou `normal` (variant light) | `--foreground` |
| **Corps**        | Inter     | `text-base` (1rem)  | `text-base`          | `400`   | `--foreground` |
| **Texte second.**| Inter     | `text-sm` (0.875rem) | `text-sm` ou `text-base` | `400` | `--muted-foreground` |
| **Labels/Tags**  | Inter     | `text-xs` (0.75rem) | `text-xs`            | `400-500` | `--foreground` |
| **Micro (dates)**| Inter     | `text-[11px]`       | `text-[11px]`        | `400-500` | `--muted-foreground` |

### 3.3 — Propriétés globales

```css
html { font-family: var(--font-sans); scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; }
```

Titres avec `leading-tight` (line-height ~1.25). Corps avec `leading-relaxed` (line-height ~1.625).

---

## 4 — Espacements et grille

### 4.1 — Conteneur principal

| Propriété      | Valeur           |
|---------------|------------------|
| Max-width     | `max-w-6xl` (1152 px) pour contenu général |
| Max-width     | `max-w-[76.5rem]` (1224 px) pour pages avec sidebar (profil, projets) |
| Padding latéral | `px-6` (24 px) |

### 4.2 — Grille de layout

| Page        | Layout                                            |
|------------|---------------------------------------------------|
| **Accueil** | Single column, sections empilées                  |
| **Projets cards** | `grid gap-6 md:grid-cols-2 lg:grid-cols-3`   |
| **Outils (profil)** | `grid gap-6 md:grid-cols-2`               |
| **Projet détail / Profil** | `lg:grid-cols-[minmax(0,56rem)_240px]` (contenu + TOC sidebar) |

### 4.3 — Espacement vertical des sections

| Section             | Padding vertical              |
|---------------------|-------------------------------|
| Hero                | `py-16 md:py-24`              |
| Sections principales | `py-12` ou `py-10 md:py-14`  |
| Contact             | `py-16`                       |
| Footer              | `py-8`                        |
| Scroll margin       | `scroll-mt-20` (80 px)        |

---

## 5 — Rayons de bordure

| Token          | Valeur                | Usage |
|----------------|----------------------|-------|
| `--radius`     | `0.5rem` (8 px)      | Base de référence |
| `--radius-sm`  | `calc(--radius - 4px)` = 4 px | Petits éléments |
| `--radius-md`  | `calc(--radius - 2px)` = 6 px | Éléments moyens |
| `--radius-lg`  | `--radius` = 8 px    | Cartes, images, modals |
| `--radius-xl`  | `calc(--radius + 4px)` = 12 px | Large containers |
| **rounded-full** | pill (50%)          | Boutons CTA, badges de statut, pills de nav |
| **rounded-2xl**  | 16 px              | Conteneur outils (accueil) |

---

## 6 — Composants UI

### 6.1 — Header (`SiteHeader`)

```
┌──────────────────────────────────────────────────────────┐
│ [Nom (Lora, bold, serif)]              [Profil] [LinkedIn] │
│ border-b border-border · bg-background/80 backdrop-blur    │
└──────────────────────────────────────────────────────────┘
```

- Fond semi-transparent + `backdrop-blur` (glassmorphism léger)
- Bouton "Profil" : `rounded-full bg-primary text-primary-foreground` (pill sombre)
- Lien LinkedIn : `text-muted-foreground hover:text-foreground`
- Hauteur min bouton : `min-h-[44px]` (accessibilité tactile)

### 6.2 — Hero Section

```
┌──────────────────────────────────────────────────────────┐
│  [Image cover en fond, opacity-40, object-cover]          │
│  [Gradient overlay: from-bg/60 via-bg/40 to-bg/80]       │
│                                                           │
│  ▌ border-l-4 border-accent (bleu ciel, 4px)             │
│  ▌                                                        │
│  ▌ [Badge] Cheffe de projet IA · Lyon                     │
│  ▌    bg-accent · rounded-full · uppercase · tracking-wide │
│  ▌                                                        │
│  ▌ H1 Titre (Lora, 2xl → 4xl)                            │
│  ▌                                                        │
│  ▌ Paragraphe d'intro (text-muted-foreground)             │
│  ▌                                                        │
│  ▌ [Bouton CTA] rounded-full bg-primary                   │
└──────────────────────────────────────────────────────────┘
```

**Badge hero** : `rounded-full bg-accent px-3 py-1 text-sm font-bold uppercase tracking-widest text-foreground`

### 6.3 — Project Card (`ProjectCard`)

```
┌──────────────────────────────────────┐
│▌ Image cover (aspect-video)          │  ← barre accent 6px à gauche
│▌ ou emoji/icône placeholder          │
│▌─────────────────────────────────────│
│▌ [Statut]              [Date 11px]   │
│▌                                     │
│▌ Titre (Lora, bold)                  │
│▌ Tagline (text-muted-foreground)     │
│▌ ✓ Impact (text-foreground)          │
│▌                                     │
│▌ │Tag│ │Tag│ │Tag│ │+N│              │
└──────────────────────────────────────┘
```

**Détails clés :**
- Barre latérale accent : `absolute left-0 top-0 bottom-0 w-[6px]` — couleur dynamique selon statut
- Hover : `hover:shadow-lg` + image `group-hover:scale-[1.02]` (zoom subtil)
- Tags limités à 4 en mode grille, avec overflow `+N`
- Tags styling : `rounded px-2 py-0.5 text-xs` — avec image : `border border-border bg-background` ; sans image : `bg-muted`
- Badge de statut : `rounded-full px-3 py-1 text-xs font-medium` — couleur dynamique
- Focus : `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`

### 6.4 — Condensed List (Formations / Missions / Bénévolat)

```
┌──────────────────────────────────────────────────────────┐
│ H2 Titre de section (Lora, bold)                          │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ [thumb]  Titre — Rôle   [Statut] · Date   Lire plus │  │
│ │────────────────────────── divider ───────────────────│  │
│ │ [thumb]  Titre — Rôle   [Statut] · Date   Lire plus │  │
│ └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- Container : `divide-y divide-border rounded-lg border border-border bg-card`
- Thumbnails : `h-10 w-10 md:h-12 md:w-12 rounded-md border border-border object-cover`
- Expand/collapse avec `grid-rows-[1fr]/[0fr]` + `opacity` transition (300ms ease-in-out)
- "Lire plus" / "Lire moins" : `text-xs font-medium text-muted-foreground hover:text-foreground`

### 6.5 — Quick Nav (barre de navigation sticky)

```
┌──────────────────────────────────────────────────────────┐
│ (Projets) (Formations) (Missions) (Bénévolat) (Outils)  │░░
│ sticky top-0 z-40 · bg-card · border-b                   │
└──────────────────────────────────────────────────────────┘
```

- Pills : `rounded-full border px-3.5 py-1.5 text-xs font-medium min-h-[36px]`
- Actif : `border-accent text-accent`
- Inactif : `border-border text-muted-foreground hover:border-accent hover:text-accent`
- Dégradé de fondu à droite : `bg-gradient-to-l from-card to-transparent` (w-10)
- Scrollbar caché : `[scrollbar-width:none]`

### 6.6 — Boutons

| Variante        | Classes                                                         | Usage |
|----------------|-----------------------------------------------------------------|-------|
| **Primary**     | `rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 min-h-[44px]` | CTA principaux |
| **Primary (md)**| `rounded-md bg-primary px-4 py-2 ...`                           | Boutons d'action (non-pill) |
| **Secondary**   | `rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted` | Actions secondaires |
| **Outline CTA** | `rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:border-primary hover:bg-muted` | Liens d'exploration ("Voir tous mes outils →") |
| **Ghost link**  | `text-accent hover:underline`                                    | Liens inline (footer, texte) |
| **Back link**   | `text-sm text-muted-foreground hover:text-foreground`            | "← Retour aux projets" |

### 6.7 — Outils et compétences (pills)

**Accueil** (flat list) :
```
│ Tool │ │ Tool │ │ Tool │ │ Tool │
  bg-accent   bg-decorative   bg-accent   bg-decorative  (alternance paire/impaire)
```
- `rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground`

**Profil** (groupé par catégorie) :
```
┌──────────────────────────────────┐
│ Catégorie (Lora, bold)           │
│ │Tool│ │Tool│ │Tool│             │
│ rounded border bg-background     │
└──────────────────────────────────┘
```
- Tags : `rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground`

### 6.8 — Block Renderer (contenu riche)

| Type bloc    | Rendu |
|-------------|-------|
| `heading`   | `h2` — `mt-8 mb-2 font-serif text-lg md:text-xl font-bold` + `scroll-mt-24` |
| `text`      | Paragraphes `whitespace-pre-line text-base leading-relaxed` avec inline markdown |
| `quote`     | `blockquote border-l-4 pl-6` — bordure `var(--decorative)` |
| `image`     | `img w-full rounded-lg border border-border` + figcaption optionnel |
| `video`     | iframe `aspect-video rounded-lg border border-border bg-black` |
| `liste`     | `list-disc space-y-1 pl-6 text-base leading-relaxed` |
| `comparatif`| Grille `md:grid-cols-2` de cartes `rounded-lg border bg-card p-5` |

### 6.9 — Formulaire d'authentification

```
┌──────────────────────────────────┐
│ H1 Connexion (Lora, 2xl, bold)   │
│                                  │
│ Email                            │
│ ┌──────────────────────────────┐ │
│ │ input border-border          │ │
│ │ focus:ring-2 ring-accent     │ │
│ └──────────────────────────────┘ │
│ Mot de passe                     │
│ ┌──────────────────────────────┐ │
│ │ input                        │ │
│ └──────────────────────────────┘ │
│ [Se connecter] bg-primary w-full │
│ Mot de passe oublié ? (accent)   │
│ ──────────── ou ──────────────── │
│ [Google] border bg-background    │
└──────────────────────────────────┘
```

- Container : `rounded-lg border border-border bg-card p-8 max-w-md`
- Inputs : `rounded-md border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-accent`
- Séparateur : `h-px bg-border` avec texte "ou" centré

### 6.10 — Footer (`SiteFooter`)

```
────────────────── border-t border-border ──────────────────
│ © Martine Desmaroux                    LinkedIn · Connexion │
│                                                             │
│ Portfolio conçu et développé avec Lovable, Claude Code...   │
│ text-[13px] leading-relaxed text-muted-foreground           │
──────────────────────────────────────────────────────────────
```

- `mt-24 border-t border-border bg-card`
- Liens : `text-accent hover:underline`
- "Connexion" : `text-xs text-muted-foreground hover:text-foreground`

### 6.11 — Back to Top

- Bouton flottant : `fixed bottom-6 right-6 z-40`
- Apparence : `h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg`
- Icône : `ArrowUp` (Lucide) `h-5 w-5`
- Apparition : IntersectionObserver sur la section hero

### 6.12 — Table des matières latérale (ProjectToc)

- Visible uniquement en `lg:block` ou `xl:block`
- Sticky sidebar de 240px
- Items : `border-l-2 border-border` → `hover:border-accent hover:text-accent`

### 6.13 — Page d'état (PageState — 404, erreur)

```
        404
   Page introuvable
   Message explicatif

   [Réessayer]  [Accueil]
```

- Centré en plein écran : `flex min-h-screen items-center justify-center`
- "404" en `text-7xl font-serif font-bold`
- Boutons primary + secondary

---

## 7 — Couleurs d'accent par statut de projet

> Fichier source : `src/lib/utils/status.ts`

Chaque projet a une barre latérale de 6 px et un badge de statut dont la couleur est déterminée automatiquement selon le label de statut, ou peut être surchargée manuellement.

| Couleur  | Hex       | Statuts associés |
|----------|-----------|------------------|
| 🟢 Vert  | `#6DCFA8` | Déployé, En production, Faite, Produit, Terminé |
| 🔵 Bleu  | `#65BFF1` | MVP, ou valeur par défaut |
| 🟠 Orange | `#ECC28F` | POC, En cours, Cadrage, Audit |

**Règle de résolution** : Si l'utilisateur a défini `accent_color` dans le CMS → cette couleur est utilisée. Sinon → auto-détection par mots-clés dans `status_label`.

### Utilisation dans les cartes

- **Barre latérale** : `style={{ backgroundColor: accent }}` (6 px, absolute left)
- **Badge avec image** : `backgroundColor: ${accent}22` (8% d'opacité) + `color: accent`
- **Badge sans image** : `border: 2px solid ${accent}` + `color: accent`
- **Placeholder sans image** : fond `${accent}14` + bordure basse `2px solid ${accent}`

---

## 8 — Animations et transitions

| Élément | Animation | Propriétés |
|---------|-----------|------------|
| **Image hover (cartes)** | Zoom subtil | `transition-transform group-hover:scale-[1.02]` |
| **Liens/Boutons** | Fade d'opacité ou changement couleur | `transition-colors` ou `transition-opacity hover:opacity-90` |
| **Expand/Collapse** | Grid row animation | `grid-rows-[1fr]/[0fr]` + `opacity-100/0` — `duration-300 ease-in-out` |
| **TOC chevron** | Rotation | `transition-transform duration-200` — `rotate(180deg)` |
| **Scroll** | Smooth scroll natif | `scroll-behavior: smooth` (CSS) |
| **Scroll to section** | JS smooth | `scrollIntoView({ behavior: "smooth", block: "start" })` |

> **Note** : Aucune animation de chargement ni skeleton n'est implémentée.
> Les micro-animations se limitent aux hover et aux transitions expand/collapse.

---

## 9 — Accessibilité (a11y)

### 9.1 — Contrastes

| Paire de couleurs | Ratio estimé | Conformité |
|-------------------|-------------|------------|
| `#1A1B2E` sur `#F0EEF9` (foreground/background) | ~14.5:1 | ✅ AAA |
| `#1A1B2E` sur `#FAFAFC` (foreground/card) | ~15.5:1 | ✅ AAA |
| `#5F5A85` sur `#F0EEF9` (muted-foreground/background) | ~4.5:1 | ✅ AA |
| `#65BFF1` sur `#FAFAFC` (accent/card) | ~3.0:1 | ⚠️ Large text only |

> ⚠️ **ATTENTION**
> L'accent `#65BFF1` ne passe le contraste AA que sur des textes **grands** ou **gras**.
> Pour du texte courant de petite taille, utiliser `--foreground` (`#1A1B2E`) ou `--muted-foreground` (`#5F5A85`).

### 9.2 — Zones tactiles

- Tous les boutons interactifs ont `min-h-[44px]` (recommandation WCAG 2.5.5)
- Quick nav pills : `min-h-[36px]` (exception acceptée pour nav secondaire)

### 9.3 — Attributs ARIA

- `aria-expanded` sur les éléments expand/collapse
- `aria-label` sur les boutons icône (BackToTop, overflow tags)
- `aria-hidden="true"` sur les éléments purement décoratifs (emojis, placeholders)
- `aria-label="Sommaire"` sur la TOC mobile

### 9.4 — Focus visible

```css
focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
```

### 9.5 — Images

- Attribut `alt` systématique, avec fallback sur le titre du projet
- `loading="lazy"` sur toutes les images non-critiques

---

## 10 — Iconographie

| Source | Usage |
|--------|-------|
| **Lucide React** | Icônes UI (ArrowUp pour BackToTop, Box pour placeholder de carte) |
| **Emoji natifs** | Emojis des projets (affichés en `text-5xl md:text-6xl`) |
| **SVG inline** | Logo Google (dans le formulaire auth) |

**Pas d'icon font** (Font Awesome, etc.). Tout est en composants SVG React.

---

## 11 — Règles d'usage strictes

> ⚠️ Ces règles sont extraites des commentaires du fichier `styles.css` et DOIVENT être respectées.

### `--decorative` (`#928DB9`)
- ✅ Bordures, séparateurs, fonds de badges, accent vertical 6px
- ✅ Barre latérale des blockquotes
- ✅ Fond alterné des pills d'outils (accueil)
- ❌ **JAMAIS pour du texte ni des liens**

### `--accent` (`#65BFF1`)
- ✅ Liens cliquables, éléments interactifs
- ✅ Mise en valeur de la section hero (bordure gauche, badge, photo profil border)
- ✅ Focus ring (`focus-visible:ring-accent`)
- ✅ Quick nav pill active
- ⚠️ **Attention au contraste** avec du texte blanc (ratio ~3:1)

### `--muted-foreground` (`#5F5A85`)
- ✅ Texte secondaire (taglines, dates, captions)
- ✅ Contraste AA vérifié sur `--background`

### Boutons arrondis (pills) vs. boutons carrés
- **Pills** (`rounded-full`) : CTA principaux (hero, contact), navigation, badges de statut
- **Carrés** (`rounded-md`) : boutons d'action dans les formulaires, boutons secondaires

---

## 12 — Responsive et breakpoints

Le projet utilise les breakpoints TailwindCSS par défaut :

| Breakpoint | Min-width | Usage principal |
|-----------|-----------|-----------------|
| `sm`      | 640px     | — (peu utilisé) |
| `md`      | 768px     | Grille 2 colonnes, tailles de texte augmentées, layout flex→row |
| `lg`      | 1024px    | Grille 3 colonnes (cartes), sidebar TOC visible (profil) |
| `xl`      | 1280px    | Sidebar TOC visible (projets détail) |

### Patterns responsive récurrents

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| Header nav | Même layout | Même layout |
| Hero | Pas de photo profil visible | Photo profil ronde 224px (`md:h-56 md:w-56`) |
| Cartes projets | 1 colonne | 2 cols (`md`) → 3 cols (`lg`) |
| Outils profil | 1 colonne | 2 colonnes |
| TOC sidebar | Accordion inline pliable | Sticky sidebar 240px |
| Thumbnails (condensed) | 40×40px | 48×48px |

---

## 13 — SEO et métadonnées

### Balises systématiques

- `lang="fr"` sur `<html>`
- `charset="utf-8"` + `viewport`
- `<title>` unique par page (pattern : `Titre — Martine Desmaroux`)
- `meta description` sur chaque page
- `canonical` link vers `https://martine-ia.lovable.app/...`
- Open Graph (`og:title`, `og:description`, `og:type`, `og:image`)
- Twitter Card (`summary_large_image`)

### Structured Data (JSON-LD)

| Page | Schema type | Données |
|------|------------|---------|
| Accueil | `Person` | name, url, jobTitle, description, sameAs (LinkedIn) |
| Profil | `Person` | idem |
| Projet | `CreativeWork` | name, headline, image, author, url, keywords, dateCreated/temporalCoverage |

### Autres fichiers SEO

- `/sitemap.xml` : sitemap dynamique
- `/llms.txt` : fichier pour crawlers IA
- `/favicon.ico` : icône du site
- `/og-default.jpg` : image OG par défaut (1200×630)

---

## Annexe — Fichiers de référence

| Fichier | Rôle |
|---------|------|
| `src/styles.css` | Design tokens CSS (source de vérité) |
| `src/lib/utils/status.ts` | Logique de couleur d'accent par statut |
| `src/routes/__root.tsx` | Polices Google Fonts + meta par défaut |
| `src/components/SiteHeader.tsx` | Composant header |
| `src/components/SiteFooter.tsx` | Composant footer |
| `src/components/ProjectCard.tsx` | Composant carte projet |
| `src/components/BlockRenderer.tsx` | Rendu des blocs de contenu |
| `src/components/QuickNav.tsx` | Navigation rapide sticky |
| `src/components/PageState.tsx` | Pages d'état (404, erreur) |
| `src/components/BackToTop.tsx` | Bouton retour en haut |
