# Portfolio — Martine

Portfolio personnel avec interface d'administration. Les textes, projets et compétences sont gérés via un back-office intégré et stockés dans Supabase — rien n'est hardcodé dans le code source.

## Stack technique

- **React 19** + **Vite**
- **TanStack Router** + **TanStack Query**
- **Supabase** (base de données, auth)
- **Tailwind CSS v4**
- **shadcn/ui** (composants Radix UI)

## Installation en local

### 1. Cloner le repo

```bash
git clone <url-du-repo>
cd <nom-du-dossier>
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env` à la racine du projet avec tes propres identifiants Supabase :

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

> Crée un projet gratuit sur [supabase.com](https://supabase.com) pour obtenir ces valeurs, ou contacte l'auteur pour demander accès à la base existante.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

## ⚠️ À propos du contenu

Cloner ce repo te donne la **structure et le design** du portfolio, pas le contenu personnel (projets, bio, compétences). Ces données vivent dans la base Supabase de l'auteur et ne sont pas incluses dans le code. Sans accès à cette base (ou sans la tienne propre), les pages s'afficheront vides.
