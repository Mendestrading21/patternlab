# ADR-013 — Exercices avancés (scénario, zone du graphique)

## Statut
Accepté (LOT 7 — Exercices avancés, skill `patternlab-product-growth`).

## Contexte
Le registry d'exercices comptait 7 formats branchés (mcq, true_false, numeric, order,
match, find_error, identify_pattern). Le skill demande d'ajouter progressivement des
formats plus riches (zones, scénarios, tracés, OHLC, replay, timed…), chacun avec
schéma, validation, renderer, **grader pur**, feedback, analytics, accessibilité, tests
et fallback aux gestes.

## Décision
Ajouter **deux** formats de qualité (les formats à tracé/replay/canvas relèvent du Lot 8) :
1. **`scenario`** (conditionnel SI/ALORS) : champ `context` (le SI) + `options` (les ALORS)
   + `validation.correctIndex`. Renderer : bloc contexte mis en avant puis choix.
2. **`select_chart_zone`** : `chartSeed` + `zones` (libellés gauche→droite) +
   `validation.correctZone`. Renderer : graphique en chandeliers avec **zones tappables
   superposées** (chaque zone = bouton accessible avec libellé), sélection et correction
   colorées. L'interaction est un simple **tap** (pas de geste complexe → fallback natif),
   sans animation (reduced-motion safe).

Chaque format suit le pattern existant : type ajouté à l'union discriminée `Exercise`,
**grader pur** enregistré dans le registry (aucune modification du reste du moteur),
renderer dédié dans `ExercisePlayer`, feedback obligatoire (pourquoi correct/faux, règle,
quand ça échoue), contenu pilote (skill.trend : zone ; skill.patterns : scénario), tests.

## Conséquences
- 9 formats branchés ; l'ajout d'un format reste local (registry + renderer + type).
- Les scénarios et zones renforcent l'analyse (setup, confirmation, invalidation).
- Tests purs des graders (`scenario`, `select_chart_zone`).

## Rollback
Retirer les deux graders du registry et les cas du renderer ; les types et le contenu
associés sont additifs. Le garde-fou « format non implémenté » reste actif pour les
formats non encore branchés (drag_drop, draw_level, timed…).
