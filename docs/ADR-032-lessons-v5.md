# ADR-032 — Leçons V5 (visual-first)

## Statut
Accepté (V5 Lot 7 — Leçons V5, skill `patternlab-v5-master`).

## Contexte
Les leçons v1 (`src/app/lesson/[id].tsx`, données dans `seed.ts`) enchaînent des steps
texte + un `chart` déterministe + une `flashcard`. La vision V5 est **visuelle-first** : chaque
leçon doit *montrer* (schéma du concept) et faire *raisonner* (hypothèse conditionnelle Toto/Bobo),
en s'appuyant sur les moteurs des lots précédents (visuel Lot 3, concepts Lot 1). Contrainte :
extension **non destructive** (les 8 leçons existantes restent valides), aucune dépendance circulaire,
contenu V5 en `draft`.

## Décision
1. **Modèle** (`src/engines/learning/types.ts`) : deux nouveaux `LessonStepKind` — **`visual`**
   (schéma SVG d'un concept) et **`hypothesis`** (hypothèse Toto haussière / Bobo risque) — plus un
   champ **`conceptRef?: string`** (slug de `LearningConcept`). `conceptRef` est une **chaîne
   primitive** : `engines/learning` ne dépend PAS de `data` (pas de cycle `data → engines → data`) ;
   la résolution du concept se fait à l'écran.
2. **Rendu** (`src/app/lesson/[id].tsx`) : le `StepView` résout le concept via
   `conceptBySlug(V5_CONCEPTS, step.conceptRef)`.
   - `visual` → `<VisualCard spec={concept.visualSpec} />` + « Comment reconnaître » (3 puces) +
     bouton **« Voir la fiche complète → »** vers `/concept/[slug]` (relie leçons ↔ fiches du Lot 3 ;
     aucun bouton mort). Repli lisible si le concept/visuel manque.
   - `hypothesis` → deux `CharacterScene` : **Toto** (observe) porte `bullishScenario.conditions[0]`,
     **Bobo** (false-signal) porte `bearishScenario.conditions[0]` ou `falseSignals[0]`. L'information
     n'est jamais portée par la seule couleur (libellés explicites + noms Toto/Bobo).
   - Note de **prochaine révision** ajoutée avant « Terminer la leçon » (la session alimente la
     répétition espacée).
3. **Contenu** (`seed.ts`) : 3 leçons visual-first (`lesson.hammer-v5`, `lesson.support-resistance-v5`,
   `lesson.double-bottom-v5`), une par concept amorce, chacune : intro → observe → **visual** →
   **hypothesis** → explain → falseSignal → summary → flashcard. `status: 'draft'` (contenu V5 jamais
   auto-publié). Elles apparaissent automatiquement dans l'onglet Leçons (aucune modification d'écran).

## Conséquences
- Leçons visuelles-first sans réécrire l'existant ; le lien leçon → concept → fiche est désormais direct.
- La « manipulation » et le « feedback » de la trame V5 restent portés par la session d'exercices
  (Lot 6) atteinte via « Terminer la leçon » ; l'« exercice graphique » du Lot 6 est ainsi enchaîné.
- Modèle sans cycle : `conceptRef` primitif ; la couche `data`/écran fait la jointure.
- Reste à faire (lots ultérieurs) : montée en contenu (Lot 9/10), step `quiz` embarqué (mini-quiz des
  concepts), et bascule `draft → needs_review → approved` après revue humaine.
