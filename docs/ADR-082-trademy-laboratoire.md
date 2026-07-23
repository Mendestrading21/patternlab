# ADR-082 — Laboratoire : lecture guidée de graphique (refonte Lot 7)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 7 (branche `feat/trademy-complete-redesign`).
Source : message produit (§ Laboratoire) et `docs/product/TRADEMY_PRODUCT_VISION.md`.

## Contexte

Le Laboratoire offrait déjà de l'interactif (tracer un support), une révélation progressive
(replay volume) et des labs d'indicateurs paramétrables, mais il manquait la capacité canonique
d'**afficher/masquer les annotations** sur un graphique et un vrai parcours de **lecture guidée**.
Un bouton mort (« Zones, lignes de tendance & annotations », désactivé) subsistait.

## Décision

**Module pur `src/data/chartLab.ts`** (testé) : `CHART_SCENARIOS` — quatre scénarios de lecture sur
datasets déterministes existants (tendance, cassure-retest, faux breakout, balayage de liquidité),
chacun avec une **question**, des **annotations** pédagogiques (label + détail), une hypothèse de
**Toto** et une garde de **Bobo**. Vocabulaire conforme (setup haussier, zone de confirmation,
invalidation, faux signal, scénario éducatif). `chartScenarioById`.

**Section « Lis un graphique, étape par étape » (`(tabs)/laboratoire.tsx`)** :
- sélecteur de scénario ;
- **révélation progressive** bougie par bougie (`MarketReplayChart`, contrôles Début/Préc./Suiv./
  Tout révéler) ;
- **bascule annotations affichées / masquées** ;
- annotations listées (icône cyan) quand affichées, invite à lire soi-même quand masquées ;
- **Toto** (hypothèse) et **Bobo** (invalidation / faux signal) ;
- rappel « scénario éducatif sur données déterministes — jamais un signal en temps réel ».

Le **bouton mort** est supprimé (les annotations sont désormais réelles).

## Conséquences

- Le Laboratoire couvre le canon : graphiques interactifs + scénarios éducatifs, afficher/masquer
  les annotations, lecture progressive, aucune donnée présentée comme signal temps réel ; plus aucun
  bouton mort.
- `chartLab.test.ts` (+4) : datasets résolus, annotations/Toto/Bobo présents, aucun vocabulaire
  interdit, `chartScenarioById`.
- Gate verte : lint · typecheck · **500 tests** (+4) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×1000) : sélecteur de scénario, révélation progressive,
  bascule d'annotations, Toto/Bobo. Voir ADR-082.
