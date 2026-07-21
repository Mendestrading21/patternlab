# ADR-070 — Labs d'indicateurs paramétrables (Learning-Master Lot 6)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 6.

## Contexte

Les indicateurs existaient en **fiches** + `IndicatorPanel` (RSI, MACD, Bollinger, moyennes, volume,
VWAP… 15 variantes), mais **statiques** : impossible pour l'apprenant d'ajuster un paramètre et de
voir la lecture changer. Le skill demande des **labs paramétrables** + des **faux signaux**.

## Décision

Réutiliser le moteur existant sans le modifier : `IndicatorPanel` accepte déjà une `IndicatorConfig`
(avec `period`/`fast`/`slow`/`k`) et `indicatorMath` calcule à partir de ces paramètres.

- **`src/engines/visual/indicatorLab.ts`** (pur, testé) — `INDICATOR_LABS` : trois labs
  (**RSI** période 7/14/21, **Moyenne mobile** longueur 4/6/9, **Bollinger** écart-type 1.5/2/2.5),
  chacun avec `paramValues`, `defaultValue`, `formatValue`, un **faux signal** éducatif et
  `configFor(value)` qui branche le paramètre choisi sur une `IndicatorConfig`.
- **Laboratoire** — nouvelle section **« Labs d'indicateurs »** : un `SegmentedControl` choisit
  l'indicateur, un second ajuste le **paramètre**, `IndicatorPanel` se **recompose en direct** avec
  `configFor(param)`, et Bobo annonce le **faux signal** correspondant. Analytics `lab_started`.
- Le lab vit dans le **hub Apprendre** (le Laboratoire y est une entrée depuis le Lot 1).

## Conséquences

- L'apprenant **manipule** un indicateur (change la période/l'écart-type) et voit sa lecture évoluer —
  la différence de comportement devient tangible.
- Chaque lab porte un **faux signal** explicite (cadrage éducatif, jamais un signal d'action).
- Aucun changement du moteur d'indicateurs : `configFor` branche le paramètre sur le calcul existant
  (`indicatorMath` reste la source de vérité, déjà testée).
- Les **quiz visuels d'indicateurs** existent déjà (famille `indicateur` de l'entraîneur / quiz
  visuel) ; ce lot ajoute la **manipulation** et les **faux signaux**.
- Gate verte : lint · typecheck · **452 tests** (+4) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×900) : section « Labs d'indicateurs », sélecteurs
  RSI/MM/Bollinger, changement de période RSI (rend), bascule Bollinger → paramètre « Écart-type » +
  faux signal « le long de la bande ». Aucune publication sans accord.
