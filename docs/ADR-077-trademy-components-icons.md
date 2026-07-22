# ADR-077 — Système d'icônes & composants partagés Trademy (refonte Lot 2)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 2 (branche `feat/trademy-complete-redesign`).
Source canonique : `docs/design/TRADEMY_LEARNING_GLASS.md`.

## Contexte

Le canon Trademy impose un **jeu d'icônes original** et interdit les emojis système comme
substituts permanents des icônes de navigation et d'action. Or la barre d'onglets utilisait des
emojis (🏠🗺️📚🔁🐂) et plusieurs primitives de la liste canonique manquaient (BrandLogo,
TrademyIcon, ProgressRing, IconButton).

## Décision

**Nouveau système d'icônes `src/design-system/icons/TrademyIcon.tsx`** : vecteurs 2D **originaux**,
monochromes, trait uniforme (grille 24×24, `react-native-svg`), ≥ 24 icônes couvrant les cinq
espaces de navigation (`home`, `learn`, `library`, `lab`, `profile`) et les actions/états
essentiels (`search`, `star`/`star-filled`, `chevron-*`, `close`, `check`, `lock`, `play`,
`refresh`, `chart`, `flame`, `trophy`, `bolt`, `target`, `info`, `settings`, `heart`, `book`).
Icône décorative par défaut (masquée au lecteur d'écran), `title` pour une icône autonome.

**`BrandLogo`** : mark original (tuile violette dégradée + courbe de marché ascendante) + wordmark
« Trademy ». Aucun asset externe.

**`ProgressRing`** (anneau de progression borné 0→1, `accessibilityRole="progressbar"`) et
**`IconButton`** (cible ≥ 44 px, `accessibilityLabel` obligatoire, variantes ghost/solid/primary)
ajoutés au design system et exportés par `@/design-system`.

**Câblage navigation** : la barre d'onglets (`src/app/(tabs)/_layout.tsx`) utilise désormais
`TrademyIcon` (teinte active = violet de marque, inactive = texte discret) — **fin des emojis de
navigation**. Le wordmark d'accueil utilise `BrandLogo`.

## Conséquences

- La navigation principale est conforme au canon (icônes originales, plus d'emoji).
- Primitives réutilisables prêtes pour les lots suivants (ProgressRing → progression/XP ;
  IconButton → barres d'action, favoris, fermeture ; TrademyIcon → cartes, filtres, états).
- Nouveau `icons.test.ts` (pur) verrouille l'exhaustivité du registre (nav + actions, sans doublon).
- Gate verte : lint · typecheck · **484 tests** (+4) · validate:content · release:check · build:web
  (34 pages, 313 réf. /TradeMy/). Vérifié en pilotant Chromium (390×844) : barre d'onglets à icônes
  Trademy (Apprendre actif violet) et wordmark d'accueil `BrandLogo`. Voir capture dans la PR.
- Reste pour les lots suivants : migrer les emojis **de contenu** (titres de section, entrées de
  hub) vers `TrademyIcon` là où ils tiennent lieu d'icône fonctionnelle.
