# Export Complet des Données du Portfolio

## Statistiques Globales
- **Nombre total de projets :** 15 (attendu: 14)
- **Nombre total de blocs :** 51

---

## 1. Réglages du Site (Table `site_settings`)

**Hero Title:** Martine Desmaroux

**Hero Subtitle:** Cheffe de projet IA

**Bio / Intro:**
En reconversion après 15 ans dans l'administration de production du spectacle vivant, je pilote aujourd'hui des projets d'IA et d'automatisation avec la même exigence de méthode, d'écoute et de livraison.

**Cover Image URL:** *(vide)*

**Contact Email:** a@supp.com

**Contact Intro Text:** *(vide)*

**Footer Text:** © Martine Desmaroux

**Titres des sections:**
- Projets phares: Projets phares
- Formations: Formations données
- Missions: Autres missions courtes
- Bénévolat: Bénévolat IA
- Outils: Outils et compétences

**Outils et Compétences (tools_json):**

```json
[
  {
    "items": [
      "Claude",
      "Claude Code",
      "Claude Cowork",
      "Mistral",
      "Gemini",
      "OpenAI GPT",
      "ElevenLabs",
      "NotebookLM",
      "Antigravity IDE",
      "Dicte.ai",
      "Whisper",
      "Perplexity",
      "Copilot Microsoft",
      "Google AI Studio"
    ],
    "category": "IA et assistants"
  },
  {
    "items": [
      "Make",
      "n8n",
      "Airtable",
      "Excel Power Query",
      "Landbot",
      "Trello",
      "Tally",
      "FlowiseAI"
    ],
    "category": "No-code / Automatisation"
  },
  {
    "items": [
      "VS Code",
      "Lovable",
      "Cursor",
      "Windsurf",
      "Base44",
      "Docker",
      "Qdrant",
      "Ollama",
      "Netlify"
    ],
    "category": "Développement et déploiement"
  },
  {
    "items": [
      "Suite Adobe (InDesign - TOSA Avancé)",
      "Figma",
      "Visily",
      "Miro",
      "Gamma",
      "Arcade.software"
    ],
    "category": "Design et prototypage"
  },
  {
    "items": [
      "Microsoft 365",
      "Excel - TOSA Expert",
      "Google Workspace"
    ],
    "category": "Suites bureautiques"
  },
  {
    "items": [
      "HubSpot",
      "Slack",
      "Discord"
    ],
    "category": "Communication et CRM"
  },
  {
    "items": [
      "Sprints (mode agile - pilotage solo)",
      "RICE",
      "Matrice Impact/Effort",
      "Gherkin (Given/When/Then)",
      "Notions RGPD/WCAG/FALC"
    ],
    "category": "Méthodes et frameworks"
  }
]
```

---

## 2. Projets et Blocs

### Projet: Off Project
- **Slug:** off-project
- **Emoji:** 🎟️
- **Tagline:** Zéro friction : du formulaire au scan, automatisation complète des invitations professionnelles en festival
- **Rôle:** Cheffe de Projet IA / Projet solo · Conception complète
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** ~5h économisées par jour de festival, flux complet testé de bout en bout
- **Cover Image URL:** https://diinujqskcmmenjbqxoi.supabase.co/storage/v1/object/public/project-images/covers/1783528045555-e37d1b.png
- **Accent Color:** *(vide)*
- **Project Type:** poc_perso
- **Mission Type:** *(vide)*
- **Repo URL:** https://gamma.app/docs/Off-Project-rlg315fuyu9haxo?mode=doc
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (8)

**[Bloc: text]** L'essentiel

Le résultat → Système validé et fonctionnel en production


**[Bloc: text]** Contexte

Avignon Off 2026 : 1 400 compagnies, demandes d'invitations professionnelles éparpillées (email, formulaire, téléphone), re-saisies manuellement côté billetterie. Retards et embouteillages garantis avant chaque représentation.


**[Bloc: text]** Décision clé

Off Project ne remplace pas le logiciel de billetterie : il crée l'interface manquante entre compagnie et théâtre. Architecture en 5 étapes automatisées de bout en bout : formulaire, billet QR généré et payé en moins de 10 secondes, mise à jour Airtable, scan à l'entrée, notification Slack. Celà sans intervention manuelle une fois le flux lancé.


**[Bloc: comparatif]** Résultat chiffré

Avant : re-saisie manuelle, ~5h perdues par jour de festival || 
Avec Off Project : flux automatisé de bout en bout, testé du formulaire au scan
Détail du calcul disponible dans le dossier complet (lien ci-dessous).


**[Bloc: liste]** Stack technique du POC

Frontend React + Vite (PWA, 4 écrans)
Orchestration n8n (Docker)
Airtable comme couche de données structurée (invitations, professionnels, spectacles, billets, notifications)
Emails transactionnels avec QR code via Brevo
Notifications temps réel vers Slack
Simulation du flux de paiement pour les places payantes


**[Bloc: image]** Formulaire de réservation - interface cie

Formulaire de soumission de demande d'invitation professionnelle


**[Bloc: video]** Démo du POC

https://www.youtube.com/watch?v=CXzJldcwjcY || Off Project POC démo (2:21) - du formulaire au scan, sans intervention manuelle


**[Bloc: liste]** Compétences démontrées

Conception d'architecture événementielle no-code/low-code de bout en bout
Design de charte graphique complète (palette, composants, états)
Traduction d'un point de friction terrain en produit fonctionnel et quantifié
Vision produit V2 déjà cadrée (Stripe, intégrations billetterie, assistant IA de parsing)


---

### Projet: Studio EISF - Générateur de podcasts pédagogiques
- **Slug:** studio-eisf-generateur-podcasts
- **Emoji:** 🎙️
- **Tagline:** Transformer les cours théoriques écrits en podcasts pédagogiques, avec double vérification IA et sobriété numérique assumée
- **Rôle:** Cheffe de Projet IA / Projet solo · Conception, pilotage technique (vibe coding), déploiement
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Outil en production, utilisé par les apprenants pour réviser leurs cours théoriques en format audio
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** production_client
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (6)

**[Bloc: text]** L'essentiel

Le problème → Cours théoriques écrits, apprenants en mobilité, besoin de format audio
Ma décision → Outil sur mesure, double vérification IA, souveraineté des données mesurée (Mistral/ElevenLabs)
Le résultat → Outil en production, 95% de fidélité au cours source, possible correction manuelle


**[Bloc: text]** Contexte

Une école de formation à distance aux métiers de bouche dispensait ses cours théoriques en format essentiellement écrit. Les apprenants, souvent en activité professionnelle en parallèle, avaient besoin d'un format consommable en mobilité.
Plutôt qu'un abonnement TTS générique, j'ai conçu un outil sur mesure : édition du contenu par une IA, modification par les formateurs avant génération (jamais de mise en ligne "à l'aveugle"), double vérification IA de la fidélité au cours source, et suivi des coûts en temps réel : trois garde-fous impossibles avec une solution clé en main.
L'ingénieur pédagogique télécharge le MP3 généré et le charge lui-même dans le cours en ligne ; l'apprenant y accède ensuite via le lecteur intégré à la plateforme de formation


**[Bloc: text]** Sobriété et souveraineté, deux choix liés

Le pipeline reste déterministe en amont : l'IA générative n'intervient que si le cours importé n'a pas de structure exploitable, ce qui limite coût et empreinte environnementale.
J'ai séparé deux outils spécialisés : Mistral pour le texte (cohérent avec le choix de souveraineté fait pour les autres outils développés pour le commanditaire de la solution) et ElevenLabs pour la voix, retenu après test comparatif face entre autres à Gemini TTS.
Make sert d'intermédiaire technique : l'école peut changer de fournisseur sans reconstruire l'outil.


**[Bloc: image]** L'interface d'édition et de vérification

Capture_d_écran_2026-07-06_141049.png || Chaque script est vérifié automatiquement par IA contre le document source (ici 99% de fidélité), avec alerte explicite de relecture humaine obligatoire avant export - le contrôle qualité n'est jamais laissé au hasard.


**[Bloc: video]** Démo interactive

https://demo.arcade.software/ZBQEKpfiNazynfjKTnLg?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true || Démo interactive du parcours complet - import, vérification, édition, export


**[Bloc: liste]** Compétences démontrées

Pilotage technique de bout en bout sans être développeuse de formation, avec des choix de conception différenciants (édition humaine, double vérification, indépendance fournisseur)
Transformation d'échecs ponctuels en protocole réutilisable : chaque incident de déploiement analysé jusqu'à sa cause exacte, sur une infrastructure mutualisée à risque, avec audit de sécurité avant mise à disposition.


---

### Projet: Agent conversationnel - Simulation de relation client
- **Slug:** agent-conversationnel-simulation-de-relation-client
- **Emoji:** 🎂
- **Tagline:** Un agent IA qui simule une commande client réelle pour entraîner les apprenants en Cake Design, 24h/24, sans formateur
- **Rôle:** Cheffe de Projet IA / Projet solo · Conception, pilotage technique (no code + vibe coding)
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Scalabilité jusqu'à 1000 apprenants/an, zéro intervention formateur
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** production_client
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (9)

**[Bloc: text]** L'essentiel

Le problème → Valider des compétences relationnelles à distance, sans formateur 24h/24
Ma décision → Agent IA à double rôle : Inspecteur (audit) et Tuteur (pédagogie)
Le résultat → Scalable jusqu'à 1000 apprenants/an, zéro intervention formateur


**[Bloc: text]** Contexte

L'EISF forme des pâtissiers en Cake Design 100% en ligne. Le défi : valider des compétences relationnelles et logistiques à distance, sans formateur disponible 24h/24, avec des risques réels (oubli d'allergies, surcharge des formateurs, appréhension des apprenants).
Ma réponse : un simulateur de commande client disponible en continu. À la fin de chaque session, l'apprenant reçoit un bilan PDF personnalisé qui pointe ses erreurs et oublis, et adapte son ton pédagogique à son niveau de réussite.


**[Bloc: text]** Le partage des rôles : l'IA pour la conversation, les règles pour ce qui ne tolère pas l'erreur

L'IA gère la richesse et la nuance de la conversation, mais la vérification des critères non négociables (allergies, contraintes de livraison) repose sur des règles strictes, pas sur l'appréciation du modèle. Ce garde-fou est indispensable dès qu'une erreur a un impact réel, pédagogique ou commercial.


**[Bloc: text]** Après la conversation : la méthode du double agent

Plutôt qu'un seul agent qui évalue et encourage à la fois - ce qui crée un biais et des oublis - j'ai séparé deux logiques incompatibles : l'Inspecteur (audit factuel, strict, non négociable sur les règles métier) et le Tuteur (feedback pédagogique bienveillant, ton adapté au score). J'ai conçu un scénario couvrant les pièges métier réels (saisonnalité, allergies, budget). Ce choix garantit un bilan à la fois rigoureux et motivant.


**[Bloc: text]** Un RAG testé, puis écarté

J'ai construit un prototype RAG (Qdrant + Ollama) pour enrichir les réponses de l'agent conversationnel à partir de la base de connaissances de l'école. Après test, j'ai choisi de l'abandonner : l'enrichissement apporté ne justifiait pas la complexité et le coût d'infrastructure supplémentaires, face à des règles déterministes déjà suffisamment fiables pour l'usage réel. Ne pas garder une brique technique séduisante quand elle n'apporte pas de valeur mesurable fait aussi partie de mon métier.


**[Bloc: quote]** Ce que ça donne concrètement : le piège de la saisonnalité

Un client demande un gâteau à base de châtaigne en juin. Si l'apprenant valide sans réagir : l'Inspecteur relève l'erreur en fin de session, le Tuteur lui prodigue des conseils. S'il refuse en expliquant la saisonnalité : l'Inspecteur valide le bon réflexe, le Tuteur félicite la posture professionnelle.


**[Bloc: image]** Le flux complet

`Flow_CakeDesign.jpg` || Architecture du flux - de la réception du message au PDF livré, cinq étapes, zéro intervention humaine une fois lancé.


**[Bloc: text]** Une extension mise en pause : le chatbot de certification

En prolongement, j'ai conçu une version pour la certification officielle (client fictif complexe, timer strict, rapport d'examen automatique). Le projet a été mis en pause avant déploiement, suite à un arbitrage entre fluidité pédagogique et fiabilité d'évaluation. Accepter qu'un projet bien conçu ne soit pas encore le bon projet à déployer fait aussi partie du métier.


**[Bloc: liste]** Compétences démontrées

- Conception d'architecture Make hybride, alliant logique déterministe et IA générative.
- Séparation des rôles Inspecteur/Tuteur pour éviter qu'un seul agent mélange évaluation factuelle et pédagogie
- Choix techniques guidés par la gouvernance : migration Gemini → OpenAI → Mistral pour la souveraineté des données, sur une infrastructure déjà adoptée par l'école (Make)


---

### Projet: L'Orienteur - Diagnostic d'orientation métiers
- **Slug:** orienteur-diagnostic-orientation-metiers
- **Emoji:** 🌱
- **Tagline:** Un quiz d'orientation déterministe plutôt qu'un chatbot IA - l'arbitrage qui a le plus de valeur pour un projet EdTech
- **Rôle:** Cheffe de Projet IA / Mission solo (projet école)
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** POC validé en 3 jours, 20 cas de test, données exploitables pour prioriser les futures formations
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** poc_ecole
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (6)

**[Bloc: text]** L'essentiel

Ma décision → Script intégré directement dans la page, contournant la restriction navigateur


**[Bloc: text]** Contexte

Projet réalisé dans le cadre de ma formation (Le Bahut), sur un cas client réel. Une EdTech naissante spécialisée dans la transition alimentaire souhaitait aider les candidats à la reconversion à s'orienter vers les métiers agricoles et agroalimentaires. Un premier POC de hackathon avait montré le potentiel de l'IA générative pour capter la nuance émotionnelle d'un projet de reconversion. Ma mission : dépasser ce stade pour livrer une solution réellement déployable, en intégrant coût, conformité RGPD, souveraineté d'hébergement et impact environnemental.


**[Bloc: text]** Mon arbitrage clé : une architecture sans IA générative

Le hackathon avait montré ce que l'IA générative pouvait apporter en finesse. J'ai pourtant recommandé une architecture entièrement déterministe pour la v1 : un questionnaire de 10 questions fermées, scoring par pondérations. Les deux enjeux réels du client - valider la demande marché et collecter des données qualifiées pour ses dossiers de financement - étaient entièrement couverts sans le coût, la latence ni l'empreinte carbone d'un modèle génératif. L'IA n'est pas la réponse par défaut, c'est un outil à activer seulement quand il apporte un gain réel.


**[Bloc: liste]** Le choix d'architecture

POC déployé sur Netlify, backend Google Apps Script (gratuit, sans dépendance tierce ni serveur à maintenir)
Données dans Google Sheets, modifiables par le client sans toucher au code (pondérations, ajout/suppression de métiers)
Hébergement UE et consentement explicite avant collecte (article 7 RGPD), email comme seule donnée identifiante
Conception s'appuyant sur  WCAG 2.1 AA et les principes FALC (langage simple, formulaires progressifs)
Pour une v1 en production : migration recommandée vers un frontend React/Vite auditable sur GitHub Pages


**[Bloc: text]** Résultat du POC

3 jours de développement accompagné par l'IA pour valider le flux technique complet (quiz → scoring → email → Google Sheets), 20 cas de test validés, tableaux d'analyse préconstruits livrés au client pour prioriser ses futures formations.


**[Bloc: liste]** Compétences démontrées

Conception d'architecture frugale et RGPD-compliant
Cadrage complet (roadmap, coûts, ROI, risques)
Vulgarisation de l'arbitrage "pas d'IA générative" auprès d'un client qui attendait initialement un chatbot conversationnel, en argumentant coût, latence et fiabilité des données plutôt que la technologie elle-même


---

### Projet: Plateforme de pré-audit client automatisée
- **Slug:** plateforme-pre-audit-client-automatisee
- **Emoji:** 📊
- **Tagline:** Agence marketing B2B - identifier le bon "quick win" IA parmi 4 solutions possibles
- **Rôle:** Cheffe de Projet IA / Analyse et priorisation en solo (projet école, phase interviews en groupe)
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Solution retenue comme quick win parmi 4 options (matrice impact/effort + RICE) ; brique centrale démontrée par POC n8n
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** poc_ecole
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (7)

**[Bloc: text]** L'essentiel

Le problème → Identifier le meilleur "quick win" IA parmi 4 solutions possibles
Ma décision → Matrice impact/effort + RICE, priorité au point de friction du CEO
Le résultat → Solution retenue et brique centrale démontrée par POC n8n


**[Bloc: text]** Contexte

Dans le cadre de ma formation, j'ai mené avec une équipe de 4 apprenants des entretiens terrain auprès d'une agence marketing B2B, pour cartographier ses processus métier et détecter les points de friction exploitables par l'IA.


**[Bloc: text]** Ma contribution individuelle - priorisation et solution retenue

À partir des retours collectifs, j'ai identifié 4 solutions IA possibles. Pour prioriser, j'ai construit seule une matrice d'impact/effort puis un framework RICE. J'ai retenu une plateforme de pré-audit client automatisée : elle répond au principal point de friction du CEO en tout début de parcours commercial, reste déployable progressivement à coût maîtrisé (consommation de tokens, pas de nouveaux abonnements), et peut aussi devenir un produit d'appel commercial, revendu aux propres clients de l'agence pour financer un budget IA plus large.


**[Bloc: liste]** Ce que j'ai réellement construit (POC)

Workflow n8n démontrant la brique cœur : formulaire → scraping du site + veille presse RSS → double analyse OpenAI GPT-4-Turbo → fiche de synthèse sur Slack, avec consigne stricte anti-hallucination
Testé sur des cas réels pour vérifier moi-même la fiabilité des analyses IA
L'architecture cible complète (intégration CRM HubSpot, Airtable) reste au stade de cahier des charges, non développée dans ce POC


**[Bloc: image]** Workflow n8n du POC

Schéma du workflow n8n (annexe 5 du dossier)


**[Bloc: video]** Démo du POC n8n

https://youtu.be/74YeI5YiLT0


**[Bloc: liste]** Compétences démontrées

Conduite d'entretiens terrain et cartographie de processus métier
Priorisation structurée (matrice impact/effort + framework RICE)
Conception d'un workflow n8n + IA générative multi-sources, avec garde-fous anti-hallucination


---

### Projet: L'Affiche digitale
- **Slug:** affiche-digitale
- **Emoji:** 📢
- **Tagline:** Diffuser des messages ciblés par formation sur une plateforme externe, sans jamais toucher à son code
- **Rôle:** Cheffe de Projet IA / Conception complète
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Système validé et fonctionnel en production, messages ciblés par formation
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** production_client
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (5)

**[Bloc: text]** L'essentiel

Le problème → Diffuser des messages ciblés sans accès au code d'une plateforme externe
Ma décision → Script intégré directement dans la page, contournant la restriction navigateur
Le résultat → Système validé et fonctionnel en production


**[Bloc: text]** Contexte et contraintes

L'école souhaitait diffuser des messages ciblés à ses apprenants sur une plateforme externe dont nous ne maîtrisions pas le code source. L'enjeu : rendre ce système pilotable par une équipe non technique.
La solution : le déploiement d'un pop-up (via l'injection d'un script léger) couplé à une automatisation. L'affichage et le contenu des messages sont ainsi entièrement pilotés depuis un simple tableau partagé (Google Sheets), avec des variations selon la formation suivie.


**[Bloc: text]** Le vrai point dur

Faire communiquer notre outil avec la plateforme externe s'est heurté aux restrictions de sécurité strictes des navigateurs (blocage inter-domaines). Plutôt que de développer un contournement complexe et fragile, j'ai privilégié la robustesse et la communication. En collaborant directement avec l'équipe technique de la plateforme, j'ai pu pivoter vers une solution "embarquée" où le composant vit directement dans la page. Résultat : zéro latence et un risque de casse technique quasi nul.


**[Bloc: liste]** Sécurité

Clé secrète sur chaque échange, pour empêcher les accès non autorisés
Contenus et liens limités aux sources vérifiées
Affichage conçu pour ne jamais exécuter de code non prévu
Chargement isolé du reste de la page, sans impact sur le fonctionnement de la plateforme


**[Bloc: liste]** Compétences démontrées

Déploiement technique de bout en bout (du script d'affichage au suivi des clics en production).
Communication différenciée selon 3 publics : technique, non-technique, prestataire externe - avec documentation dédiée à chacun
Coordination itérative avec un prestataire externe jusqu'à la mise en production


---

### Projet: Générateur EISF - YouTube vers pages web (AEO avancé)
- **Slug:** generateur-eisf-youtube-pages-web-aeo
- **Emoji:** 🎬
- **Tagline:** Transformer les vidéos de formation en articles web trouvables par les moteurs de recherche et les IA, sans jamais inventer de contenu
- **Rôle:** Cheffe de Projet IA / Conception complète
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Chaque vidéo transformée en article web trouvable et fiable, sans invention de contenu
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** production_client
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (3)

**[Bloc: text]** Contexte

Une école produit des vidéos de formation (démonstrations, interviews) qui restent difficiles à retrouver après coup : pas de version écrite, pas de référencement. J'ai conçu un Gem Gemini qui transforme chaque vidéo en page web structurée : résumé, entités clés (techniques, ingrédients, compétences), FAQ et contenu adapté au format éditorial le plus pertinent (guide pratique, recette, décryptage technique, interview...) avec balisage Schema.org pour le référencement. En amont, l'outil optimise aussi la fiche YouTube elle-même : titre, description, tags et chapitres.


**[Bloc: text]** La garantie clé : jamais d'invention

Le contenu source vient de formateurs certifiés sur des sujets techniques précis. J'ai conçu un workflow strict en 10 étapes validées une à une, jamais fusionnées, jamais sautées, avec séparation systématique entre ce qui vient de la vidéo, des informations fournies, et de la structuration IA. Si une donnée manque, l'outil l'indique explicitement plutôt que de deviner : un point non négociable pour du contenu pédagogique qui doit rester fiable.


**[Bloc: liste]** Compétences démontrées

Conception d'un outil qui priorise la fiabilité du contenu plutôt que la vitesse de génération
Structuration d'un processus reproductible avec validation humaine à chaque étape clé
Optimisation d'un contenu vidéo pour le rendre visible à la fois par les moteurs de recherche classiques et par les IA conversationnelles


---

### Projet: Akampus : Partenariats avec des établissements culturels et scolaire sensibiliser à l'IA et à la protection des données personnelles
- **Slug:** akampus-partenariats-theatres
- **Emoji:** 🏫
- **Tagline:** Bénévolat : mise en réseau de théâtres et de collèges pour des actions de sensibilisation à l'IA destinées aux jeunes publics et à leurs aînés
- **Rôle:** Cheffe de Projet IA / Bénévole : apport réseau et montage de partenariats
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Mise en relation de l'association avec des théâtres et des collèges partenaires potentiels ; participation au montage budgétaire et à la recherche de mécénat.
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** benevolat
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Formation pratique Claude - initiation Projects, Skills, Cowork (2h)
- **Slug:** formation-pratique-claude-2h
- **Emoji:** 🎓
- **Tagline:** Formation individuelle en direct : intitiation à l'écosystème Claude (Projects, Skills, Cowork), avec démonstration d'automatisation en conditions réelles
- **Rôle:** Cheffe de Projet IA - conception et animation, pour le directeur de l'école
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Session de 2h, incluant la création live d'un Skill réutilisable pour automatiser un rapport récurrent
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** formation
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Formation Gemini magistrale - équipe pédagogique
- **Slug:** formation-gemini-magistrale-equipe-pedagogique
- **Emoji:** 🎓
- **Tagline:** Formation live en visioconférence sur les assistants IA personnalisés (Gems), pour une équipe pédagogique de 6 personnes
- **Rôle:** Cheffe de Projet IA - conception et animation
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Session d'1h animée en direct, avec démonstration live et ressources pratiques distribuées à l'équipe
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** formation
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Réunir 70 000 photos (Google Photos)
- **Slug:** reunir-70000-photos-google-photos
- **Emoji:** 🖼️
- **Tagline:** Création d'un moteur de recherche par IA pour une photothèque culinaire. Développement d'un script Python (assisté par Gemini) pour unifier, dédupliquer et structurer une base de 70 000 photos éparpillées sur plusieurs comptes Google.
- **Rôle:** Cheffe de Projet IA
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Le traitement a permis de nettoyer massivement la base avec plus de 12 000 doublons supprimés et près de 17 000 fichiers extraits de sous-dossiers cachés. La photothèque est désormais entièrement centralisée et optimisée pour tirer pleinement parti de la recherche visuelle IA de Google Photos.
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** mission
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Chatbot d'orientation (HubSpot)
- **Slug:** orientation-chatbot-hubspot
- **Emoji:** 🎓
- **Tagline:** Arbitrage stratégique : choix d'un chatbot déterministe (HubSpot) au lieu de l'IA pour garantir un déploiement urgent et sans surcoût.
- **Rôle:** Cheffe de Projet IA et automatisation
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Déploiement express à 0€ de surcoût, nativement connecté au CRM existant de l'école.
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** mission
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Guide IA équipe pédagogique
- **Slug:** guide-ia-equipe-pedagogique
- **Emoji:** 🎓
- **Tagline:** Cadre de bonnes pratiques IA pour l'équipe pédagogique : outils autorisés, protection des données, contrôle qualité
- **Rôle:** Cheffe de Projet IA
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Document de référence pour toute l'équipe, couvrant outils autorisés, minimisation RGPD, protocole de relecture et convention de nommage des livrables IA
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** mission
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Guide bonnes pratiques IA apprenants
- **Slug:** guide-bonnes-pratiques-ia-apprenants
- **Emoji:** 🎓
- **Tagline:** Guide des bons réflexes IA pour les apprenants : protéger ses données, garder un travail authentique
- **Rôle:** Cheffe de Projet IA
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** Prêt à être diffusé à l'ensemble des apprenants, clarifie l'usage autorisé des outils IA sans jamais remplacer le rôle du tuteur
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** formation_mission
- **Mission Type:** mission
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

*(Aucun bloc de contenu pour ce projet)*

---

### Projet: Martine Desmaroux - Cheffe de projet IA
- **Slug:** martine-desmaroux-cheffe-de-projet-ia
- **Emoji:** *(vide)*
- **Tagline:** *(vide)*
- **Rôle:** *(vide)*
- **Statut:** *(vide)*
- **Stack / Tags:** *(vide)*
- **Impact:** *(vide)*
- **Cover Image URL:** *(vide)*
- **Accent Color:** *(vide)*
- **Project Type:** profil
- **Mission Type:** *(vide)*
- **Repo URL:** *(vide)*
- **Repo Note/Label:** *(vide)*
- **Published:** true
- **Order Index:** undefined
- **Project Date:** *(vide)*

#### Blocs de contenu (7)

**[Bloc: text]** Qui je suis

Je pilote des projets IA et automatisation avec un regard pragmatique : partir des vrais points de friction, pas de la technologie pour elle-même. Cette posture vient de mes 15 ans d'administration de production en spectacle vivant — dont plusieurs années en théâtre public — où j'ai géré des budgets multi-partenaires, négocié des contrats et coordonné des équipes techniques et artistiques sous contrainte de délais non négociables : une date de représentation ne se décale pas. En septembre 2025, j'ai entamé une reconversion vers la gestion de projet IA, en alternance à l'EISF, dans le cadre d'une formation de cheffe de projet IA au Bahut. Ce portfolio présente une sélection de projets menés en formation, en alternance, et en initiative personnelle — conception, arbitrage technique et pilotage de projets IA, du POC au déploiement.


**[Bloc: text]** Ce qui traverse mes projets

Choisir l'IA générative seulement quand elle apporte une valeur réelle, jamais par défaut. Piloter des projets techniques sans être développeuse de formation. Prioriser la souveraineté des données quand le contexte l'exige. Transformer un incident ponctuel en protocole réutilisable plutôt que le subir deux fois.



**[Bloc: text]** Parcours

"Reconversion — Formation Cheffe de Projet IA, Le Bahut (Lyon), depuis sept. 2025 → lien
Alternance — EISF, école de formation à distance aux métiers de bouche → lien
15 ans en spectacle vivant — administration de production, production, diffusion, communication, assistanat de direction, relations avec les publics, relations presse, billetterie : Compagnie Ariadne/Anne Courel, Cie La Chambre Noire, Rask!ne et Cie, Théâtre de la Croix-Rousse, Théâtre de l'Élysée/Scène Découvertes, Les Subsistances, et autres compagnies"


**[Bloc: text]** Ce que mon expérience dans le spectacle vivant m'apporte

15 ans d'administration de production en spectacle vivant : gestion budgétaire multi-partenaires, négociation de contrats, coordination d'équipes techniques et artistiques sous contrainte de délais non négociables (une date de représentation ne se décale pas). Cette rigueur de pilotage — arbitrage ressources/risques/délais — se retrouve directement dans ma façon de cadrer un projet IA.


**[Bloc: text]** Comment je travaille

Je choisis mes outils selon la tâche, pas un outil universel appliqué par défaut — arbitrage entre abonnements et facturation à l'usage selon les besoins réels de chaque projet. J'applique à l'IA la même rigueur de gestion de risque et de délai qu'à une production artistique : la conception, l'architecture, le choix d'outils et le prompt engineering sont miens ; l'implémentation s'appuie sur le vibe coding (Claude Code, Lovable) et sur des développeurs quand le projet l'exige. Sauf mention contraire, tous les projets EISF ont été menés seule, à distance, sans équipe de développement — de la conception au déploiement.


**[Bloc: text]** Exemple concret : arbitrage Claude/ChatGPT

À l'EISF, j'ai par exemple recommandé de remplacer l'abonnement ChatGPT par Claude Pro : l'équipe utilisait déjà Gemini au quotidien pour le chat, rendant ChatGPT redondant, tandis que Claude apportait des capacités avancées directement utiles à mon rôle et à celui du directeur (automatisation marketing, agents de code, connecteurs) — un choix aligné avec les valeurs de gouvernance de l'école en matière d'outils IA.


**[Bloc: liste]** Outils

No-code / Automatisation: Notion, Airtable, n8n, Make, Arcade.software, Landbot, Tally, Trello
IA & Assistants: Claude Code, Claude Cowork, Google AI Studio, Antigravity IDE (IDE agentique Google), Gemini, ChatGPT, Copilot Microsoft, Dicte.ai, NotebookLM
Design & Prototypage: Visily, InDesign (TOSA Avancé 855/1000)
Développement: VS Code, Lovable
Suites bureautiques: Microsoft 365 (Excel — TOSA Expert 912/1000), Google Workspace
Communication & CRM: HubSpot, Slack, Discord


---

