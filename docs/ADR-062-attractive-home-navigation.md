# ADR-062 — Accueil vivant & navigation élargie (Exp-Max Lot 9)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 9.

## Contexte

L'accueil était complet mais figé (salutation fixe) et la grille « Explorer » ne surfait pas les
fonctionnalités visuelles récentes (Quiz visuel, Bibliothèque). Objectif : rendre l'accueil plus
vivant, donner un **sens de progression en un coup d'œil**, et améliorer la découvrabilité — sans
bouton mort.

## Options

1. Refonte lourde de l'accueil (risqué, coûteux).
2. Enrichissements ciblés : salutation contextuelle, **aperçu de progression**, grille Explorer
   élargie. *(retenu)*
3. Ajouter des animations partout (contraire à la réduction d'animation).

## Décision

Option 2.
- Module pur `src/data/greeting.ts` : `greetingFor(hour)` → Bonjour / Bon après-midi / Bonsoir /
  Bonne nuit (borné/assaini). L'accueil affiche la salutation selon l'heure locale.
- **Carte « 🚀 Ta progression »** sous la mission : quatre tuiles — Concepts explorés, Mondes
  débloqués (`worldsUnlocked(buildWorldPath(...))`), Badges (`earnedBadges` / `BADGES.length`), Série
  (jours). Un sens de progression immédiat, réutilisant les données déjà présentes.
- **Grille « Explorer » élargie** de 4 à 6 tuiles, ajoutant **Quiz visuel** (`/reconnaissance`) et
  **Bibliothèque** (`/bibliotheque-visuelle`) — toutes les destinations clés surfacées, chaque tuile
  navigue vers une route réelle (zéro bouton mort).

## Conséquences

- Accueil plus vivant (salutation contextuelle) et plus « Duolingo » (progression en un coup d'œil) ;
  toutes les fonctionnalités visuelles accessibles depuis l'accueil.
- Gate verte : lint · typecheck · **417 tests** (+2, `greeting.test`) · validate:content 31 ·
  release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : « Bonsoir, apprenti ! »,
  carte « Ta progression » (Concepts / 3/15 Mondes / 0/23 Badges / Série), Explorer avec Quiz visuel
  + Bibliothèque, **0 erreur console**.

## Rollback

Réversible : restaurer la salutation fixe, retirer la carte de progression et les deux tuiles
Explorer ajoutées. Aucun changement de schéma ni de persistance.
