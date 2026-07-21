# ADR-065 — Navigation & accueil simplifiés : hub « Apprendre » (Learning-Master Lot 1)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 1.

## Contexte

L'audit relève trois frictions (voir `references/01`, `references/02`, plan des 14 lots) :

- Le **Laboratoire** occupe seul un onglet principal alors qu'il est une modalité, pas une
  destination de premier niveau.
- L'**accueil est dense** : mission + snapshot de progression + concept du jour + révisions +
  quêtes + grille « Explorer » de 6 raccourcis + mascottes + disclaimer. La mission n'est plus le
  centre visuel incontestable.
- Le **catalogue** d'apprentissage (leçons, quiz, bibliothèque, glossaire, labo) est éparpillé
  entre l'accueil et des onglets, sans hub clair.

La navigation cible du skill : 5 onglets `Accueil · Parcours · Apprendre · Réviser · Profil`, le
Laboratoire devenant une entrée d'`Apprendre`.

## Options

1. Garder la barre actuelle et seulement alléger l'accueil (le Laboratoire resterait un onglet
   concurrent, le catalogue sans domicile clair).
2. **Introduire le hub `Apprendre`, y ranger le catalogue et le Laboratoire, et recentrer l'accueil
   sur la mission** *(retenu)*.

## Décision

Option 2, sans nouvelle logique métier (câblage de routes existantes).

- **`(tabs)/apprendre.tsx`** (nouveau) — hub calme : intro Toto + liste d'entrées vers des routes
  **réelles** (Leçons `/lecons`, Quiz éclair `/quiz`, Quiz visuel `/reconnaissance`, Bibliothèque
  visuelle `/bibliotheque-visuelle`, Glossaire `/glossaire`, **Laboratoire** `/laboratoire`).
  Aucun bouton mort.
- **`(tabs)/_layout.tsx`** — la barre passe à `Accueil · Parcours · Apprendre · Réviser · Profil`.
  Le **Laboratoire** quitte la barre (`href:null`, toujours atteignable depuis Apprendre) ; l'onglet
  Révisions est relibellé **« Réviser »**. `lecons`/`quiz` restent hors barre.
- **`(tabs)/index.tsx`** — accueil recentré : mission dominante (avec progression compacte : niveau,
  série, pièces, XP) + pointeur **Révision due** + **Concept du jour** + disclaimer. Retirés : la
  grille « Explorer » (→ Apprendre), le second bloc « Ta progression » (redondant), la carte
  **Quêtes** et la carte de conseils décorative.
- **`reussites.tsx`** — accueille la carte **Quêtes du jour** (déplacée hors du CTA principal),
  rendue seulement si l'état est chargé.

## Conséquences

- Une seule destination pour « apprendre librement » ; le Laboratoire n'est plus un onglet
  concurrent ; l'accueil met la mission au centre.
- Routes typées régénérées au build pour `/apprendre` ; aucune route supprimée (liens préservés).
- La relocalisation **complète** des quêtes hors du CTA et la refonte du modèle de progression
  restent au **Lot 11** ; la hiérarchie unique monde → module → compétence est le **Lot 2**.
- Gate verte : lint · typecheck · **423 tests** · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : 5 onglets sans « Labo », hub Apprendre (6
  entrées), accueil allégé, Quêtes présentes dans Réussites. Aucune publication sans accord.
