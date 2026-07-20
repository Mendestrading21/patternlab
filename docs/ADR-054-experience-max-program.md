# ADR-054 — Programme « Experience Max » & parcours visuel-first (Lot 1)

## Statut

Accepté — 2026-07-20. Ouvre le programme `patternlab-experience-max` ; Lot 1 livré.

## Contexte

Le moteur de visuels (VisualCard, CandleAnatomy, CandlestickGlyphs, PatternChart, InteractiveChart…)
et 38 concepts riches existent, mais l'utilisateur ne voyait **aucun graphique ni bougie** dans le
parcours d'entrée. Cause vérifiée : le parcours d'un nouvel utilisateur (onboarding →
`/session/skill.actions`) enchaînait des **exercices 100 % texte**, et l'écran de session ne rendait
**que les exercices, jamais les leçons** — or ce sont les leçons qui portent les étapes visuelles.
Les bougies n'apparaissaient qu'au 3ᵉ skill. Ce n'était pas un bug de rendu (l'export web contient
bien les SVG) mais un défaut de **câblage du contenu dans le flux**.

## Options

1. Ajouter des visuels partout à la main, écran par écran (dispersé, non systémique).
2. Rendre le flux « apprendre puis s'exercer » (surfacer les leçons dans la session) **et** rendre le
   premier skill visuel-first, en réutilisant les composants existants. *(retenu)*
3. Réécrire l'onboarding/parcours (coûteux, risqué, hors périmètre d'un lot).

## Décision

Option 2. (a) Factoriser le rendu des étapes de leçon en composant partagé
`src/components/LessonStepView.tsx` (hors `src/app/`, donc non-route). (b) Ajouter une **phase
« Apprendre »** dans `/session/[skillId]` qui rend la 1ʳᵉ leçon (bougies + graphique) avant les
exercices ; les points de contrôle (sans leçon) démarrent directement en pratique. (c) Rendre
`skill.actions` visuel-first dans `seed.ts` (étapes observe/visual/chart + exercice graphique tôt).
(d) Afficher une vraie bougie dans le diagnostic d'onboarding. (e) Relier chaque nœud du parcours à
sa fiche concept via `conceptSlugForSkill`. Aucune nouvelle route ; réutilisation maximale.

## Conséquences

- Les bougies/graphiques apparaissent **dès la première minute** ; une question porte un graphique
  en chandeliers ; chaque compétence donne accès à sa fiche concept.
- Les leçons (contenu visuel déjà écrit) sont enfin vues dans le flux principal.
- Ordre des hooks respecté (état `phase` déclaré avant tout retour) ; Pressables non imbriqués ;
  déterminisme conservé (seed 2024, datasets existants) ; gate verte (386 tests, 31/14).
- Programme `patternlab-experience-max` ouvert (roadmap 10 lots), publié en live à chaque lot.

## Rollback

Réversible par lot : retirer la phase « Apprendre » (le flux redevient exercices seuls), annuler les
ajouts `seed.ts`/onboarding/parcours, et supprimer `LessonStepView` en réintégrant le rendu dans
`/lesson/[id]`. Aucun changement de schéma de données ni de migration.
