# ADR-046 — Un signal visuel sur chaque carte (initiative visuelle, lot 5)

## Statut
Accepté. **Dernier lot** de l'initiative « un signal visuel partout ». Tient l'objectif explicite de
l'utilisateur : *sur chaque question, chaque carte, chaque concept, toujours un signal visuel de ce que
c'est comme modèle*.

## Contexte
Les Lots 1–4 ont bâti une bibliothèque de **64 figures** (chandeliers, figures chartistes, structure/SMC,
indicateurs) dessinées en code. Il restait à **câbler** ces signaux dans les surfaces d'apprentissage :
les cartes de révision et le quiz n'affichaient que du texte.

## Décision
1. **Vignette `MiniVisual`** : rendu compact d'un `VisualSpec` (petite boîte SVG, sans texte, résumé
   porté par `accessibilityLabel`). Réutilise le moteur (bougies, overlays de figures, zones de
   structure) ; les types non-bougie retombent sur la série de prix comme signal.
2. **Deck de révision** : `buildRevisionDeck` transporte désormais le `visualSpec` du concept sur chaque
   flashcard et mini-quiz ; l'écran affiche une `MiniVisual` en tête de chaque carte. Chaque carte de
   révision porte donc le signal visuel de sa figure.
3. **Onglet Quiz** : nouvelle carte « Ce que tu vas reconnaître » — une grille de vignettes des concepts
   à repérer (marteau, double creux avec ligne de cou, support/résistance avec zones, doji, étoile
   filante, anatomie), chacune étiquetée.

## Conséquences
- L'apprentissage est **visuel-first partout** : fiches concept (Lot V5-3), galerie (Lot 1), et
  maintenant cartes de révision et quiz portent tous un schéma original, généré en code et accessible.
- `MiniVisual` est réutilisable pour de futures surfaces (exercices, leçons) sans code de rendu nouveau.
- Garanti par test : chaque carte du deck porte un `visualSpec` avec dataset et résumé accessible.
- **Initiative complète** (Lots 1 → 5) : bibliothèque de chandeliers, figures chartistes + moteur
  d'overlays, structure & SMC, indicateurs, câblage partout. 64 figures, 7 familles. Validations vertes.
  Aucune image de référence copiée. **Aucun push ni publication sans accord explicite.**
