# ADR-008 — Navigation (IA à 5 onglets)

## Statut
Accepté (LOT 2 — Navigation, skill `patternlab-product-growth`).

## Contexte
La barre d'onglets V1 exposait Accueil, Parcours, **Leçons**, **Quiz**, Profil.
Le skill fixe l'architecture cible : **Accueil, Parcours, Laboratoire, Révisions,
Profil**, avec un accueil centré sur **une seule action principale : la mission du
jour**. Il faut adopter cette IA sans perdre les écrans Leçons/Quiz existants
(« préserver le travail », « zéro bouton mort »).

## Options
- Supprimer Leçons/Quiz (perte de travail — refusé).
- Les garder comme onglets (barre à 7 — dilue l'IA cible).
- **Barre à 5 onglets** conforme au skill, Leçons/Quiz conservés comme routes hors
  barre (`href: null`), accessibles depuis l'accueil (Explorer) et les Leçons.

## Décision
1. **5 onglets** : Accueil · Parcours · **Laboratoire** · **Révisions** · Profil.
   `lecons` et `quiz` restent des routes du groupe `(tabs)` mais `href: null` les
   retire de la barre ; elles restent atteignables (Explorer sur l'accueil, lien
   depuis Leçons).
2. **Laboratoire** (nouvel écran) : aperçu réel — chandeliers déterministes
   (`PatternChart`), figure Double Creux avec **zone de confirmation** et
   **invalidation / faux signal**, débat Toto/Bobo. Le tracé interactif est
   explicitement daté du Lot 8 (bouton désactivé avec raison — pas de bouton mort).
3. **Révisions** (nouvel écran) : surface la répétition espacée — compétences dues
   (CTA de révision) + vue d'ensemble (maîtrise, prochaine échéance) + état vide.
4. **Accueil recentré** : logique pure `buildDailyMission` (priorité révision due >
   apprentissage > terminé) → une seule action principale ; progression compacte ;
   les révisions détaillées pointent vers l'onglet dédié.
5. **Routes typées** régénérées (`.expo/types`) ; PWA/manifest inchangés.

## Conséquences
- IA conforme au skill ; accueil lisible avec une priorité unique.
- Leçons/Quiz préservés et accessibles ; aucun bouton mort.
- `buildDailyMission`/`selectDueReviews` testés (logique pure, sans React).

## Rollback
Restaurer les entrées `lecons`/`quiz` dans `(tabs)/_layout.tsx` et retirer les deux
nouveaux écrans ; la logique `dailyMission` est additive et sans effet de bord.
