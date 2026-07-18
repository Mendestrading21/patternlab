# ADR-012 — Leçons V2 (steps enrichis, graphiques, flashcards)

## Statut
Accepté (LOT 6 — Leçons V2, skill `patternlab-product-growth`).

## Contexte
Les leçons V1 n'avaient que quatre types de steps (explain / example / interaction /
summary) rendus en simples cartes de texte. Le skill (« Leçon V2 ») demande des steps
plus riches : hook, observation, graphique, faux signal / limite, flashcard, résumé,
et le principe « toujours expliquer la règle et quand elle peut échouer ».

## Décision
1. **Modèle de step étendu** (`engines/learning/types.ts`), rétrocompatible :
   nouveaux kinds `intro` (hook), `observe`, `chart`, `warning`, `falseSignal`,
   `flashcard` (en plus des existants). `body` devient optionnel ; ajout de
   `chartSeed` (graphique reproductible) et `flashcard { front, back }`.
   Le schéma JSON de contenu n'impose rien sur `kind` → `validate:content` reste vert.
2. **Contenu enrichi** : les leçons pilotes (action, bougie, double creux) passent en
   V2 (hook → observation → graphique → faux signal → résumé → flashcard). Le graphique
   réutilise `PatternChart` + `generateCandles` (déterministe).
3. **Composant `Flashcard`** (design system) : question au recto, réponse révélée au
   toucher, **sans animation** (reduced-motion safe), accessible (`expanded`).
4. **Écran leçon** rend chaque kind avec un libellé/accent dédié (faux signal = accent
   bearish, résumé = accent primaire, warning = ambre) ; les steps `chart` affichent le
   graphique, les steps `flashcard` la carte interactive.
5. **Helper pur `lessonContent`** : `flashcardsForSkill` / `allFlashcards` collectent les
   flashcards — réutilisable par les révisions dans un lot ultérieur. Testé.

## Conséquences
- Leçons plus vivantes et pédagogiques, avec observation guidée et faux signaux.
- Les flashcards deviennent une brique réutilisable pour la révision.
- Aucun contenu V1 cassé (steps existants toujours valides).

## Rollback
Restaurer l'écran de rendu simple ; les nouveaux kinds/champs sont optionnels et
additifs. Le composant `Flashcard` et `lessonContent` sont autonomes.
