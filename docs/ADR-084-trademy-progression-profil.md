# ADR-084 — Progression, XP, séries & badges (Profil, refonte Lot 9)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 9 (branche `feat/trademy-complete-redesign`).
Source : message produit (§ Profil et progression) et `docs/product/TRADEMY_PRODUCT_VISION.md`.

## Contexte

Le Profil affichait niveau/XP/pièces/série et des liens (statistiques, réussites, premium), mais il
manquait la lecture canonique de la progression : **XP vers le niveau suivant**, **concepts
maîtrisés**, **révisions recommandées** et **erreurs fréquentes**. Le composant `XPBar` du canon
n'existait pas.

## Décision

- **Composant `XPBar`** (`src/design-system/components/XPBar.tsx`) : badge de niveau (icône `star`) +
  progression bornée vers le niveau suivant + « Plus que N XP ». Points pédagogiques, jamais une
  devise réelle.
- **Profil (`(tabs)/profil.tsx`)** — carte **« Ta progression »** :
  - `XPBar` (niveau, XP dans le niveau) ;
  - chips à icônes Trademy : **série** (`flame`), **points** (`bolt`), **concepts maîtrisés**
    (`trophy`, calculés via `conceptMasteryStatus` sur `V5_CONCEPTS`) ;
  - **révisions recommandées** (icône `refresh`, nombre dû via `selectDueReviews`) → `/revisions` ;
  - « Voir le détail » (statistiques).
  - carte **« Tes erreurs fréquentes »** conditionnelle : top misconceptions
    (`summarizeMisconceptions` sur les `errorTags` agrégés) avec conseil et lien vers Réviser.
- Rappel éducatif via le composant `Disclaimer`.

## Conséquences

- Le Profil couvre le canon : niveau, XP, série, points, concepts maîtrisés, révisions recommandées,
  erreurs fréquentes, accessibilité (réduction d'animation), plus les accès existants
  (statistiques, réussites/badges, premium, confidentialité, à propos).
- Réutilise des modules purs déjà testés (`conceptMasteryStatus`, `selectDueReviews`,
  `summarizeMisconceptions`) — pas de nouvelle source de vérité.
- Gate verte : lint · typecheck · **500 tests** · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×900) : « Ta progression » (XPBar, chips à icônes,
  révisions), mascottes. Voir ADR-084.
