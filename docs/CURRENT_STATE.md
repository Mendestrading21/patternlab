# État courant de TradeMy / PatternLab

**Date de référence :** 22 juillet 2026

**Dépôt :** `Mendestrading21/TradeMy`

**Base vérifiée :** `main` au commit `5f34d57`

**Branche de fondation :** `cleanup/repository-foundation`

## Produit

Le socle Expo/React Native est fonctionnel et ne doit pas être reconstruit. PatternLab possède déjà
sa navigation à cinq onglets, son parcours de 15 mondes, ses leçons, exercices, révisions, glossaire,
bibliothèque visuelle, laboratoires, progression locale et guides Toto/Bobo.

Les valeurs exactes du corpus et des registres ne sont jamais maintenues ici : consulter
`src/data/repoTruth.ts`, contrôlé par `src/data/repoTruth.test.ts`.

## Fondation 2026-07-22

- identité produit **PatternLab** séparée du nom de dépôt **TradeMy** ;
- chemin GitHub Pages centralisé dans `config/deployment.json` et contrôlé sous `/TradeMy/` ;
- Node/npm harmonisés pour local, CI et déploiement ;
- icônes Expo remplacées par l’identité Toto/Bobo sur web, iOS, Android et splash ;
- un seul skill Claude actif et trois documents d’entrée canoniques ;
- ZIP WMB, moodboards bruts, sources graphiques lourdes et scripts temporaires retirés de l’arbre
  courant ; ils restent récupérables dans l’historique Git de la base ;
- contenu et assets runtime inchangés : ce lot est une fondation, pas une refonte fonctionnelle.

## Programme actif

Le programme `patternlab-learning-master` reste la trajectoire produit. Les lots 0 à 9 et le premier
incrément du Lot 10 sont dans `main`. La prochaine évolution produit doit poursuivre un seul objectif
à la fois : enrichissement éditorial revu humainement, puis progression/rétention, sans rouvrir les
anciens programmes archivés.

## Refonte Trademy — en cours (branche `feat/trademy-complete-redesign`)

Transformation complète vers l'identité **Trademy** guidée par les documents canoniques (vision,
Trademy Learning Glass, Toto/Bobo, architecture 500+, plan d'exécution — PR #2 fusionnée). Exécution
par lots ; `main` n'est jamais modifié directement ; livrable = une PR vers `main`.

- **Lot 1 — Identité & tokens** ✅ : marque publique **Trademy** partout (app.json, appInfo,
  manifeste PWA, `+html`, écrans Accueil/Profil/Premium, label éditorial), signature
  « Ne parie pas. Comprends. ». Design system **Trademy Learning Glass** installé dans
  `src/design-system/tokens.ts` : marque **violette** (CTA), marché vert/rouge, or (zones), cyan
  (annotations), feedback pédagogique **distinct** du marché, bloc `motion`. Contraste WCAG AA
  reverrouillé ; nouveau `tokens.test.ts` garde l'identité. Voir **ADR-076**.

- **Lot 2 — Composants & icônes** ✅ : système d'icônes **Trademy** original
  (`src/design-system/icons/TrademyIcon.tsx`, ≥ 24 vecteurs monochromes) câblé dans la barre
  d'onglets (fin des emojis de navigation) ; `BrandLogo` (mark + wordmark) sur l'Accueil ;
  `ProgressRing` et `IconButton` ajoutés au design system ; `icons.test.ts` verrouille le registre.
  Voir **ADR-077**.

- **Lot 3 — Navigation & cinq espaces** ✅ : barre canonique **Accueil · Apprendre · Bibliothèque ·
  Laboratoire · Profil** pilotée par une source unique `src/lib/navigation.ts` (+ `navigation.test.ts`).
  Le Laboratoire redevient un onglet ; Réviser est intégré à l'Accueil/Profil. Hub « Bibliothèque »
  à icônes Trademy (fin des emojis de nav) ; composant `Disclaimer` unifié. Aucune route perdue,
  aucun renommage d'URL. Voir **ADR-078**.

- **Lot 4 — Onboarding & Accueil** ✅ : `Chip` accepte les icônes Trademy (`iconName`) ; Accueil à
  chips iconifiées (niveau/série), **rangée Révisions + Favoris**, **intervention de Bobo** (les deux
  mascottes présentes), rappel via `Disclaimer` ; onboarding : sélection à icône `check`. Voir **ADR-079**.

- **Lot 5 — Parcours Apprendre** ✅ : roadmap à **niveaux** (Débutant/Intermédiaire/Avancé via
  `LEVEL_BANDS`), **cinq états** avec légende (verrouillé/disponible/en cours/terminé/**maîtrisé**),
  badges `TrademyIcon` (cadenas/coche/trophée), prérequis visibles. Modèle pur + tests. Voir **ADR-080**.

- **Lot 6 — Bibliothèque** ✅ : l'espace devient un **index de concepts cherchable**
  (`src/data/conceptLibrary.ts`, pur + testé) : recherche, collections Tous/Favoris/Récents, filtre
  par famille (compte) et par statut de maîtrise, cartes → fiche avec favori. Outils de référence
  conservés. Voir **ADR-081**.

- **Lot 7 — Laboratoire** ✅ : section **« Lis un graphique, étape par étape »** — scénarios
  (`src/data/chartLab.ts`, pur + testé : tendance, cassure-retest, faux breakout, liquidité),
  **révélation progressive** + **bascule annotations affichées/masquées** + Toto/Bobo ; bouton mort
  supprimé. Voir **ADR-082**.

- **Lot 8 — Quiz & feedback** ✅ : `AnswerOption` (QuizOption) marque correct/incorrect via icônes
  Trademy (`check`/`close`) ; `FeedbackPanel` gagne une icône de statut + un emplacement visuel/mascotte ;
  la session **intègre la mascotte dans le panneau de correction** (Toto réussite / Bobo idée fausse).
  Voir **ADR-083**.

- **Lot 9 — Progression & Profil** ✅ : composant **`XPBar`** ; carte « Ta progression »
  (XPBar niveau/XP, chips à icônes série/points/**concepts maîtrisés**, **révisions recommandées** →
  Réviser) ; carte conditionnelle **« Tes erreurs fréquentes »** (misconceptions). Voir **ADR-084**.

- **Lot 10 — Toto/Bobo & animations** ✅ : système déjà mûr (24 états, pop évènementiel + flottement
  au repos, **rendu statique si reduced-motion**, présence sur tous les écrans). Ajout de l'état
  canonique **`point`** (Toto pointe le graphique annoté au Laboratoire) + couverture testée. Voir **ADR-085**.

- **Lot 11 — Schéma canonique & enrichissement** ✅ : le type `LearningConcept` gagne `estimatedMinutes`
  (durée) et `dialogue` (interventions Toto/Bobo), **optionnels**, portés par le concept (source
  unique). Concepts phares « Marché expliqué » enrichis ; surfacés sur la fiche (puce durée + bloc
  Toto/Bobo) et la Bibliothèque. Correspondance canon→schéma documentée. Voir **ADR-086**.

- **Lot 12 — A11y, responsive & finitions** ✅ : audit propre (0 couleur en dur dans les écrans,
  0 « PatternLab » visible, 0 vocabulaire interdit hors gardes) ; garde-fou `noHardcodedColors.test.ts` ;
  responsive vérifié à **320 / 390 / 430 px** en Chromium ; contraste AA et reduced-motion verrouillés.
  Voir **ADR-087**.

- **Lot 13 — Validation finale & PR** ✅ : `npm run check` **vert** (lint · typecheck · 503 tests ·
  validate:content · release:check · build:web) ; `expo-doctor` 18/20 (2 échecs réseau-seul) ; captures
  **avant/après** produites (Chromium). **PR #3** ouverte vers `main`
  (`feat/trademy-complete-redesign`).

> **Refonte Trademy — terminée** (Lots 1→12), livrée en PR #3 vers `main`. `main` n'a pas été modifié
> directement ; la fusion et le déploiement restent à la décision humaine.

## Gate canonique

```bash
npm ci
npm run check
```

Le résultat exact de la gate appartient au rapport de commit/PR, jamais à une valeur historique
copiée ici.

## Limites connues

- Les fichiers retirés de la branche restent présents dans l’historique Git public. Une purge de
  l’historique serait une opération séparée, destructive et soumise à validation explicite.
- Les imports WMB pédagogiques ne sont pas encore normalisés vers un générateur runtime unique.
- Les builds natifs signés et les stores exigent les comptes Apple/Google du propriétaire.
- `npm audit` ne remonte plus de vulnérabilité haute ou critique. Les alertes modérées restantes sont
  transitives dans la chaîne Expo ; la correction automatique proposée rétrograderait le SDK et ne
  doit pas être appliquée avec `--force`.
