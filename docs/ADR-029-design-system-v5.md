# ADR-029 — Design System V5 (Instrument Glass, extension)

## Statut
Accepté (V5 Lot 2 — Design System V5, skill `patternlab-v5-master`).

## Contexte
La v1 portait déjà la direction « Instrument Glass » (surfaces mates graphite/bleu nuit, ≈ 70/20/10,
tokens + garde de contraste AA). La vision V5 demande une **extension** (pas une refonte) : aligner le
fond profond, introduire une sémantique **« avancé »** pour les concepts experts, et fournir des
composants réutilisables là où des motifs étaient réécrits à la main (étoile favori, barre de vues).
Contrainte : **non destructif**, AA garanti par test, aucun composant mort (chaque nouveau composant
est câblé dans un écran réel).

## Décision
1. **Palette (tokens.ts)** : `backgroundDeep` aligné sur **#070B11** (fond profond V5) ; ajout de la
   sémantique **`advanced` #9B7CF6** (concepts experts, distincte des sémantiques financière et
   pédagogique) + `onAdvanced` #1A1030 pour les remplissages. Ajout des jetons **verre** `glass`
   (voile translucide) et `glassBorder` (liseré clair). Tous vérifiés AA : `advanced` comme texte
   ≥ 5.0 sur les surfaces de carte, `onAdvanced` sur `advanced` ≥ 4.5, `backgroundDeep` conserve
   textMuted à 6.8. La garde `contrast.test.ts` inclut désormais `advanced` (ACCENT_TEXT) et
   `onAdvanced` (textes on-couleur).
2. **Tonalité pédagogique (tone.ts, pur + testé)** : `difficultyTone(1→5)` → Découverte (technique) /
   Intermédiaire (ambre) / **Avancé (violet)**, avec `clampDifficulty`. Traduit un chiffre en libellé +
   couleur ; l'information n'est jamais un chiffre nu ni portée par la seule couleur.
3. **Composants réutilisables (câblés)** :
   - `FavoriteButton` — étoile ★/☆ accessible (label explicite, `accessibilityState.selected`).
     Remplace le motif répété dans le glossaire (liste + 2 fiches).
   - `SegmentedControl<T>` — barre de segments vue/filtre, un actif à la fois, pastille de comptage
     optionnelle. Remplace les onglets « pilule » manuscrits du glossaire (vues Tout/Favoris/Récents,
     avec compteurs favoris et récents).
   - `Badge` — pastille de comptage/statut (0 masqué), pleine ou contour.
   - `GlassCard` — carte « verre sombre contrôlé » (voile + liseré + profondeur discrète), réservée aux
     blocs héros. Utilisée pour le résumé « En bref » de la fiche concept.
4. **Écran fiche concept** : la puce de difficulté passe de `neutral` à la tonalité `difficultyTone`
   (`Avancé · 4/5` en violet quand pertinent) ; le résumé passe en `GlassCard`.

## Conséquences
- Extension additive : aucun écran cassé, la garde AA reste verte et couvre les nouveaux jetons.
- Moins de duplication (étoile ×3, barre de vues ×1) → cohérence et maintenance simplifiées.
- Le violet `advanced` prépare la hiérarchie de difficulté des mondes/concepts experts (lots contenu).
- Règles respectées : une priorité par écran, pas de glow généralisé, pas d'emoji comme système
  d'icônes principal (l'étoile reste un affordance ponctuel), statique/reduced-motion safe.
- Reste hors périmètre (lots ultérieurs) : `MasteryRing`, `Tooltip`, `BottomSheet`, `AnnotatedChart`,
  `CheatSheetPanel`, thème clair — introduits quand une donnée réelle les alimente.
