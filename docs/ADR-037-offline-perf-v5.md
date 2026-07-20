# ADR-037 — Offline & performance V5

## Statut
Accepté (V5 Lot 12 — Offline & perf, skill `patternlab-v5-master`).

## Contexte
PatternLab est **local-first** : contenu embarqué + progression AsyncStorage, aucune dépendance réseau
pour la boucle d'apprentissage (`offline.ts`, `connectivity.ts`). La couche V5 (12 concepts riches,
10 datasets de visuels, 15 mondes, glossaire unifié) a été ajoutée aux lots précédents mais **n'était
pas reflétée** dans le résumé hors-ligne, et certaines données dérivées statiques étaient recalculées à
chaque rendu. Ce lot **réutilise** la base v1 et l'étend à la couche V5.

## Décision
1. **Offline — couverture V5** : `OfflineCapabilities` gagne `concepts`, `visualDatasets`, `worlds`,
   `unifiedGlossary`. `offlineCapabilities()` les calcule depuis `V5_CONCEPTS`, `VISUAL_DATASETS`,
   `WORLDS`, `UNIFIED_GLOSSARY`. `contentReady` exige désormais aussi concepts + visuels. Les visuels
   sont **générés en code** (datasets déterministes) — jamais téléchargés, donc disponibles hors-ligne
   par construction. La carte « Mode hors-ligne » du Profil affiche honnêtement ces compteurs.
2. **Perf — mémoïsation des dérivés statiques** : sur l'écran Parcours, `buildWorldOverview` /
   `worldsWithContent` / `coverageTotals` (entrées = constantes de module) sont enveloppés dans
   `useMemo` (calcul unique, plus à chaque rendu déclenché par la progression) — **avant** tout retour
   anticipé (règle des Hooks). Sur le Laboratoire, `generateCandles` (séries déterministes) est
   mémoïsé. Aucun changement de sortie : mêmes valeurs, moins de calcul.

## Conséquences
- Le résumé hors-ligne est complet et honnête (parcours v1 + couche V5), garanti par test
  (`offline.test.ts` vérifie concepts/visuels/mondes embarqués + déterminisme).
- Moins de recalcul par rendu sur les écrans riches ; comportement identique (déterministe).
- Vérifié en conditions réelles : hors-ligne (Playwright `setOffline`), la navigation client vers une
  fiche concept rend son visuel SVG sans réseau, et l'indicateur de connectivité bascule réactivement.
- Reste à faire : source de connectivité native (NetInfo) le moment venu ; budget de perf mesuré
  (profilage) si des écrans plus lourds apparaissent aux lots de contenu (500+).
