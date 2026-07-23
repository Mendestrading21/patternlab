# ADR-078 — Navigation & architecture des cinq espaces (refonte Lot 3)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 3 (branche `feat/trademy-complete-redesign`).
Source : message produit le plus récent (« ARCHITECTURE DE L'EXPÉRIENCE ») — prévaut sur la
version antérieure de `TRADEMY_PRODUCT_VISION.md` selon la règle « le blueprint le plus récent
l'emporte ».

## Contexte

Le canon Trademy structure l'expérience autour de **cinq espaces** : Accueil · Apprendre ·
Bibliothèque · Laboratoire · Profil. La barre existante était Accueil · Parcours · Apprendre ·
Réviser · Profil, avec le Laboratoire sorti de la barre (consolidation learning-master, ADR-065).

## Décision

**Source unique de navigation** `src/lib/navigation.ts` (`PRIMARY_SPACES`) : les cinq espaces, dans
l'ordre, chacun avec son icône Trademy. `(tabs)/_layout.tsx` mappe cette liste ; plus aucun onglet
codé en dur.

Mapping (réutilisation des routes existantes — **aucun renommage d'URL ni de route typée**, aucune
perte de données) :

- **Accueil** = `index` (icône `home`).
- **Apprendre** = `parcours` (roadmap des mondes ; en-tête « Apprendre / Ton parcours »), icône `learn`.
- **Bibliothèque** = `apprendre` (hub de référence : glossaire, figures, quiz, leçons ; en-tête
  « Bibliothèque »), icône `library`. Entrées migrées vers `TrademyIcon` (fin des emojis).
- **Laboratoire** = `laboratoire` (redevient un onglet à part entière), icône `lab`.
- **Profil** = `profil` (icône `profile`).

**Réviser** quitte la barre (`revisions` en `href:null`) : intégré à l'Accueil (carte « Révisions »
déjà présente) et au Profil. `lecons` et `quiz` restent hors-barre, accessibles depuis Bibliothèque.

**Composant `Disclaimer`** (`src/components/Disclaimer.tsx`) : rappel éducatif unique, utilisé à
l'Accueil et à l'écran d'ouverture (fin de la recréation locale).

## Conséquences

- Les cinq espaces canoniques sont en place, avec icônes originales et sans emoji de navigation.
- `navigation.test.ts` verrouille : cinq espaces ordonnés, routes uniques, icônes valides, écrans
  hors-barre non ré-affichés.
- Aucune fonctionnalité perdue : Réviser reste à un tap depuis l'Accueil ; toutes les routes
  historiques restent accessibles (aucun bouton mort).
- Note de dette : les URL internes restent historiques (`/parcours` = espace Apprendre, `/apprendre`
  = espace Bibliothèque) ; un renommage de fichiers de route est différé (hors périmètre, éviter la
  régénération de routes typées et la réécriture des liens).
- Gate verte : lint · typecheck · **488 tests** (+4) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×844) : barre à cinq espaces (Laboratoire = onglet,
  icône fiole ; Bibliothèque actif violet), entrées à icônes Trademy.
