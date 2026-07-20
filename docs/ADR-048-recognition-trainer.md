# ADR-048 — Entraîneur « Reconnais la figure »

## Statut
Accepté. Première fonctionnalité **interactive** bâtie sur la bibliothèque visuelle (72 figures) : un
entraîneur de reconnaissance gamifié. Sert la mission de PatternLab (apprentissage financier gamifié)
et fait *travailler* la bibliothèque au lieu de seulement l'exposer.

## Contexte
Les lots précédents ont produit 72 figures dessinées en code, réparties en 7 familles, avec résumés
accessibles. Il manquait une boucle d'apprentissage active qui les exploite : voir une figure, la nommer,
recevoir un retour pédagogique.

## Décision
1. **Logique pure** `recognitionTrainer.ts` : `buildRecognitionSession(seed, count, optionCount)` génère
   des manches déterministes (PRNG mulberry32) depuis `PATTERN_LIBRARY` — une figure cible + des intitulés
   distracteurs **pris en priorité dans la même famille** (plus exigeant), complétés par d'autres familles.
   Testé (cibles distinctes, bonne réponse présente, options uniques et réelles, déterminisme, bornage).
2. **Mode « énigme » de `VisualCard`** (`blind`) : masque étiquettes et résumé et remplace l'alternative
   textuelle par un libellé neutre — la réponse ne fuite pas, **y compris au lecteur d'écran**. Après
   réponse, l'écran repasse la carte en mode normal : la figure se révèle (annotations + résumé).
3. **Écran `/reconnaissance`** : quiz 8 manches, score + série, options en boutons accessibles
   (marqueurs ✓/✗ textuels, jamais la seule couleur), retour Toto/Bobo, écran de résultat (réussite %,
   meilleure série, rejouer). Entrée depuis l'onglet Quiz.

## Conséquences
- La bibliothèque visuelle devient un **jeu d'apprentissage** : reconnaître les figures, avec des
  distracteurs de même famille pour un vrai défi ; déterministe et testable.
- `VisualCard.blind` est réutilisable pour d'autres exercices de reconnaissance (leçons, sessions).
- Accessibilité soignée : énigme sans fuite au lecteur d'écran, retour non porté par la seule couleur,
  révélation pédagogique après réponse.
- Validations vertes ; nouvelle route typée régénérée. **Aucun push sans accord explicite.**
- Piste future : persister un score/streak et débloquer des badges « œil de lecteur » (extension
  gamification), et un mode « par famille » ou chronométré.
