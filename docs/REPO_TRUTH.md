# Vérité du dépôt (compteurs générés)

Source unique : **`src/data/repoTruth.ts`** — tous les compteurs sont **dérivés des registres du
code** (jamais recopiés d'un document). Garantis par **`src/data/repoTruth.test.ts`** :

- cohérence : chaque compteur == longueur du registre correspondant ;
- unicité : aucun doublon d'id/slug (concepts, compétences, badges, glossaire, mondes, catégories,
  types de visuels) ;
- réconciliation des formats d'exercice : déclarés vs branchés, écart nommé explicitement ;
- intégrité : chaque compétence a leçon + exercices ; chaque lien `CONCEPT_BY_SKILL` résout ;
- pins structurels : compétences, mondes, catégories, types de visuels (leur évolution passe par
  un lot dédié, pas par une dérive silencieuse).

> **Règle de documentation.** Ne jamais écrire un compteur à la main dans la doc. Citer `repoTruth`
> (ou reprendre l'instantané ci-dessous, qui est régénéré à partir du module). Un contenu qui
> change fait évoluer le compteur automatiquement ; une incohérence casse la CI.

## Instantané courant

| Métrique | Registre (code) | Valeur |
|---|---|---|
| Concepts riches V5 | `V5_CONCEPTS` | 58 |
| Compétences (parcours pilote) | `SKILLS` | 4 |
| Leçons | `LESSONS` (via `getLessons`) | 15 |
| Exercices | `EXERCISES` (via `getExercises`) | 28 |
| Termes de glossaire (v1) | `GLOSSARY_TERMS` | 24 |
| Badges | `BADGES` | 23 |
| Mondes | `WORLDS` | 15 |
| Catégories | `CATEGORIES` | 13 |
| Types de visuels rendables | `SUPPORTED_VISUAL_TYPES` | 10 |

## Formats d'exercice — réconciliation

- **Déclarés** (`ALL_EXERCISE_TYPES`) : **16**.
- **Branchés** (`supportedTypes()`, un grader enregistré) : **13**.
- **En attente** (déclarés sans grader ni renderer canonique) : `drag_drop`, `draw_level`, `timed`.

Ces trois formats seront finalisés ou retirés au **Lot 7** (registre unique
`EXERCISE_FORMAT_REGISTRY`). D'ici là, `gradeExercise` lève une erreur explicite si l'un d'eux est
soumis — jamais de correction silencieuse.

## Obtenir les compteurs

```ts
import { REPO_TRUTH, repoTruthLines } from '@/data';

console.log(repoTruthLines().join('\n'));
```
