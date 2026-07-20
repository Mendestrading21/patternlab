# ADR-058 — Leçons immersives : manipulation replay (Exp-Max Lot 5)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 5.

## Contexte

Les leçons V5 riches suivaient déjà l'arc observe → visuel → hypothèse Toto/Bobo → faux signal →
résumé, mais **sans manipulation** : le pas « interactif » manquait. De plus, la phase « Apprendre »
de la session rend `lessons[0]`, or la première leçon de `skill.trend` et `skill.patterns` était
encore minimale (explain + summary). Objectif : rendre chaque compétence pilote **immersive**.

## Options

1. Ajouter un écran interactif séparé (fragmente le flux d'apprentissage).
2. Ajouter un **pas de manipulation** au moteur de leçons (révélation du graphique bougie par bougie)
   et enrichir la première leçon de chaque compétence pilote à l'arc complet. *(retenu)*
3. Rendre les charts animés automatiquement (contraire à la réduction d'animation).

## Décision

Option 2.
- Nouveau composant `src/components/LessonReplay.tsx` : révèle un graphique en chandeliers **bougie
  par bougie** au toucher (boutons ◀ / Révéler ▶ / Tout révéler / Recommencer), avec compteur et
  `accessibilityLabel`. Statique (l'utilisateur pilote le rythme → compatible réduction d'animation) ;
  s'appuie sur `MarketReplayChart` + la logique pure `chartEngine` (`initReplay`/`stepReplay`/…).
- `LessonStepView` : le pas `interaction` (déjà dans la taxonomie) rend désormais `LessonReplay`
  (graine via `chartSeed`) au lieu d'un simple texte.
- `seed.ts` : la **première leçon des 4 compétences pilotes** suit l'arc immersif
  observe → visuel (`conceptRef`) → hypothèse Toto/Bobo → **manipulation** → explication → résumé.
  `lesson.read-trend` et `lesson.reversal-figures` reconstruits ; `lesson.candle-basics` et
  `lesson.action-definition` complétés d'un pas de manipulation (et d'un visuel pour candle-basics).

## Conséquences

- Chaque compétence pilote s'ouvre sur une leçon immersive avec un vrai temps de manipulation ;
  la phase « Apprendre » (Lot 1) en bénéficie directement.
- Gate verte : lint · typecheck · **399 tests** · validate:content 31 · release:check 14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : phase « Apprendre » de `skill.trend`
  (observe/visuel/hypothèse Toto-Bobo/manipulation), replay fonctionnel (6→9→26/26 bougies), **0
  erreur console**.

## Rollback

Réversible : rebasculer le pas `interaction` sur un rendu texte dans `LessonStepView`, retirer
`LessonReplay`, et restaurer les leçons minimales dans `seed.ts`. Aucun changement de schéma.
