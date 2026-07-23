# ADR-080 — Parcours « Apprendre » : niveaux & états de maîtrise (refonte Lot 5)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 5 (branche `feat/trademy-complete-redesign`).
Source : message produit (§ Apprendre) et `docs/product/TRADEMY_PRODUCT_VISION.md`.

## Contexte

Le canon veut un espace « Apprendre » = roadmap progressive avec **niveaux** (débutant /
intermédiaire / avancé), **prérequis visibles** et les **cinq états** verrouillé / disponible /
en cours / terminé / **maîtrisé**. La roadmap existait (15 mondes, déblocage par maîtrise) mais sans
bandes de niveau, sans état « maîtrisé », et avec des emojis en indicateurs.

## Décision

**Modèle pur `src/data/learningMap.ts`** :
- `LEVEL_BANDS` + `levelBandForOrder(order)` : trois bandes de cinq mondes
  (Débutant 1–5 · Intermédiaire 6–10 · Avancé 11–15).
- `WorldEntry.mastered` : un monde est « maîtrisé » quand il est **terminé** ET **toutes ses fiches
  sont maîtrisées** (compétence liée solide). `LearningProgressInput.masteredSlugs` (optionnel)
  alimente ce calcul sans coupler le modèle au type de progression des compétences.

**Écran `(tabs)/parcours.tsx`** (espace « Apprendre ») :
- en-têtes de bande **DÉBUTANT / INTERMÉDIAIRE / AVANCÉ** ;
- **légende des cinq états** (pastilles colorées) ;
- badges de nœud en `TrademyIcon` : `lock` (verrouillé), `check` (terminé), `trophy` (maîtrisé),
  numéro d'ordre sinon ; puce de statut avec le **vocabulaire canonique** (Disponible, En cours,
  Terminé, Maîtrisé, Verrouillé) ; jalons à icône `target` ;
- prérequis visibles (raison du verrou) inchangés ;
- l'écran calcule `masteredSlugs` via `conceptMasteryStatus` sur `state.skills`.

## Conséquences

- L'espace Apprendre couvre le canon : roadmap à niveaux, prérequis visibles, cinq états dont
  « maîtrisé » réellement dérivé de la maîtrise (pas de la visite).
- `learningMap.test.ts` (+2) : bandes de niveau (couverture des 15 mondes) et règle de maîtrise
  (terminé + fiches maîtrisées).
- Gate verte : lint · typecheck · **490 tests** (+2) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×900) : bande « Débutant », légende des états,
  monde 1 « En cours » (module guidé), monde 2 « Verrouillé » (badge cadenas + raison). Voir ADR-080.
- Suite : le parcours prioritaire « Marché expliqué » (10 leçons jouables) relève de l'enrichissement
  éditorial (lot Contenu) ; la structure d'accueil est prête.
