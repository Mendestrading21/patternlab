# ADR-031 — Exercices graphiques V5

## Statut
Accepté (V5 Lot 6 — Exercices graphiques, skill `patternlab-v5-master`).

## Contexte
Le moteur d'exercices v1 (`src/engines/exercise/`) est extensible par conception : union discriminée
`Exercise`, **registre de graders purs**, `ExercisePlayer` qui dispatche par `type`. Il portait déjà 9
formats (mcq, true_false, numeric, order, match, find_error, identify_pattern, scenario,
select_chart_zone). La vision V5 impose d'ajouter des **formats graphiques** : chaque format = schéma,
grader pur, renderer, feedback, analytics, accessibilité, tests, fallback.

## Décision
Ajouter **3 formats graphiques** en respectant l'architecture existante (aucun changement du cœur) :

1. **`place_invalidation`** — placer un niveau de prix (invalidation) sur un graphique.
   - Grader **pur** : `|réponse − targetPrice| ≤ tolerance` (tolérance absolue) — aucune dépendance de
     rendu, entièrement testable. Cible + tolérance **déterministes**, calculées dans `seed.ts` depuis la
     série reproductible (`supportLevel`/`resistanceLevel`) : la ligne révélée coïncide avec la correction.
   - Renderer : réutilise `InteractiveChart` (tap + flèches ↑/↓ pour l'accessibilité), révèle la cible au verrouillage.
2. **`label_chart`** — étiqueter un élément mis en évidence (bougie marquée par un repère ▲).
   - Grader : égalité d'index. Renderer : chandeliers en `react-native-svg`, bougie marquée mise en avant
     (opacité) + repère triangulaire `reward`. L'information n'est **jamais** portée par la seule couleur :
     forme du repère + `accessibilityLabel` désignant la bougie + libellés d'options.
3. **`sequence_market_structure`** — remettre des phases de structure de marché dans l'ordre.
   - Grader : `numberArrayEquals(réponse, correctOrder)`. Renderer : graphique d'illustration optionnel +
     liste réordonnable (↑/↓). La logique de réordonnancement est **factorisée** (`ReorderList`), réutilisée
     par `order` et `sequence_market_structure`.

Chaque format : type dans l'union + `ALL_EXERCISE_TYPES`, grader enregistré, cas dans `ExercisePlayer`,
libellés dans les écrans session/quiz, exercices de démonstration dans `seed.ts` (skill.patterns), tests
de grader. La session et le quiz étant pilotés par les données, les nouveaux formats apparaissent sans
modifier ces écrans.

## Conséquences
- 12 formats branchés (dont 3 graphiques). Le moteur reste ouvert : ajouter un format n'impacte pas les autres.
- Graders purs et déterministes → couverts par des tests unitaires ; cibles reproductibles (même seed ⇒ même correction).
- Accessibilité préservée : alternatives aux gestes (flèches), labels explicites, aucune information par la seule couleur.
- Réutilise les moteurs des lots précédents (`InteractiveChart`/`priceScale` du Lot 5, rendu SVG du Lot 3).
- Reste à faire (lots ultérieurs) : `reconstruct_ohlc`, `match_pattern_context`, `compare_setups`,
  `identify_false_signal`, `candle_replay`, `confidence_rating`, `timed_challenge` — mêmes patrons
  (type + grader pur + renderer + tests).
