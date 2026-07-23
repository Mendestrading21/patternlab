# ADR-086 — Schéma canonique de concept & enrichissement (refonte Lot 11)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 11 (branche `feat/trademy-complete-redesign`).
Source : `docs/product/LEARNING_CONTENT_ARCHITECTURE.md` (unité canonique d'un concept).

## Contexte

Le canon impose un **schéma de données commun** pour chaque concept. Le type `LearningConcept`
existant couvrait déjà l'essentiel ; deux champs de la liste canonique manquaient : **durée** et
**interventions de Toto/Bobo**. La consigne : « ne pas dupliquer, migrer et enrichir le contenu
existant » — donc pas de seconde source de vérité.

## Correspondance canon → schéma (`LearningConcept`)

| Canon | Champ |
|---|---|
| identifiant / titre / résumé | `id`,`slug` / `title` / `definitionShort` |
| famille / difficulté / prérequis | `categoryId` / `difficulty` / `prerequisites` |
| **durée** | **`estimatedMinutes`** (ajouté) |
| objectifs / définition / explication progressive | `learningObjective` / `definitionDetailed` / `howToRecognize`,`contextRequired` |
| graphique / annotations | `visualSpec` (+ `visualSpec.annotations`) |
| exemple / contre-exemple / faux signal | scénarios `bullish/bearish/neutral` / `falseSignals` |
| zone de confirmation / invalidation / scénario éducatif | `confirmationZone` / `invalidation` / scénarios |
| erreur fréquente | `commonMistakes` |
| **intervention Toto / Bobo** | **`dialogue.toto` / `dialogue.bobo`** (ajouté) |
| quiz / flashcards / liens / version | `miniQuizzes` / `flashcards` / `relatedConceptIds` / `version` |

## Décision

- **Schéma** (`learningConcept.ts`) : ajout de `estimatedMinutes?: number` (durée) et
  `dialogue?: ConceptDialogue { toto; bobo }` — **optionnels** (enrichissement itératif, aucune
  rupture des 67 concepts existants). Portés **par le concept** (source unique).
- **Enrichissement** des concepts phares du parcours « Marché expliqué » (`marche-et-prix`,
  `tendance-haussiere`, `cassure-retest`, `faux-breakout`) : durée + dialogue Toto/Bobo, vocabulaire
  conforme.
- **Surfaces** : fiche `/concept/[slug]` (puce durée + bloc dialogue Toto/Bobo) ; carte Bibliothèque
  (durée après la difficulté).

## Conséquences

- Le schéma est **entièrement canonique** ; l'enrichissement se poursuit par incréments sans
  dupliquer ni créer de seconde source.
- `conceptEnrichment.test.ts` (+2) : durée/dialogue bien formés là où présents (vocabulaire conforme),
  concepts phares enrichis.
- Gate verte : lint · typecheck · **502 tests** (+2) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×940) : fiche `cassure-retest` (puce « 5 min », bloc
  Toto/Bobo). Voir ADR-086.
