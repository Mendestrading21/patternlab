# ADR-003 — Stockage local

## Statut
Accepté (P0.1).

## Contexte
Le prototype doit persister la progression (niveau, XP, révisions) hors ligne, via une
abstraction permettant de migrer plus tard sans changer les appelants.

## Options
- AsyncStorage (clé/valeur).
- Expo SQLite (relationnel).
- MMKV.

## Décision
**AsyncStorage** derrière une interface `ProgressRepository` (avec impl mémoire pour
les tests). Un champ `schemaVersion` permet la migration. Passage à **Expo SQLite**
prévu quand le volume de contenu/progression le justifiera — sans toucher aux écrans.

## Conséquences
- Simplicité maximale au P0.1, compatible web/iOS/Android.
- Migration de schéma anticipée (rejet des états d'une version antérieure).

## Rollback
Changer d'implémentation = fournir une nouvelle classe conforme à `ProgressRepository`.
