# ADR-079 — Onboarding & Accueil Trademy (refonte Lot 4)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 4 (branche `feat/trademy-complete-redesign`).
Source : `docs/product/TRADEMY_PRODUCT_VISION.md` (§ Accueil) et `docs/product/TOTO_BOBO_CANON.md`.

## Contexte

L'onboarding présentait déjà Toto et Bobo et un diagnostic visuel ; l'Accueil était recentré
(mission, progression, révision, concept du jour). Manquaient, côté canon : l'accès rapide aux
**favoris**, la présence des **deux mascottes** sur l'Accueil, et l'usage du **système d'icônes**
(plutôt que des emojis) pour les indicateurs fonctionnels.

## Décision

**`Chip` accepte désormais `iconName` (TrademyIcon)** en plus de `icon` (emoji de contenu) —
rétro-compatible. Les indicateurs fonctionnels passent au système d'icônes.

**Accueil (`(tabs)/index.tsx`)** :
- chips de progression à icônes Trademy (niveau = `star`, série = `flame`), exercices = `book` ;
- **rangée d'accès rapide Révisions + Favoris** (Réviser n'étant plus un onglet) : Révisions →
  `/revisions` (icône `refresh`, état « X à revoir » / « à jour »), Favoris → Bibliothèque
  (icône `star`) ;
- **intervention de Bobo** (prudence : « on vérifie, on ne devine pas ») en complément de Toto sur
  la mission — les deux mascottes sont présentes ;
- rappel éducatif via le composant `Disclaimer`.

**Onboarding (`onboarding.tsx`)** : l'indicateur de sélection passe à `TrademyIcon` `check`
(icône fonctionnelle). Toto + Bobo restent présents dès l'accueil et au diagnostic.

## Conséquences

- L'Accueil couvre le canon : reprise/mission, progression, série, recommandation (concept du jour),
  intervention de mascotte, **accès rapide favoris + révisions**.
- Les emojis restent réservés au contenu ; les indicateurs de statut utilisent l'icône Trademy.
- Gate verte : lint · typecheck · **488 tests** · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×844) : Accueil (chips à icônes, rangée
  Révisions/Favoris, mascottes, concept du jour à chandeliers). Voir ADR-079.
- Suite : le favoris pointe la Bibliothèque ; une vue Favoris dédiée arrivera au lot Bibliothèque.
