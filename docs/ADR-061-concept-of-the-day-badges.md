# ADR-061 — Concept du jour & badges de rétention (Exp-Max Lot 8)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 8.

## Contexte

La gamification (XP, maîtrise, série, pièces, quêtes, mission du jour, révision espacée, badges)
était déjà solide. Objectif du lot : renforcer la **rétention** avec un hook quotidien visuel et
étoffer les **paliers de badges** — sans introduire de mécanique de pari (conforme au positionnement).

## Options

1. Ajouter des notifications / mécaniques de streak agressives (hors périmètre, risque de pression).
2. Un **« concept du jour »** (rotation déterministe, visuel) sur l'accueil + de nouveaux badges de
   paliers supérieurs adossés aux stats déjà suivies. *(retenu)*
3. Refondre le système de quêtes (déjà présent, pas prioritaire).

## Décision

Option 2.
- Module pur `src/data/conceptOfTheDay.ts` : `dayNumber(now)` (jour UTC) + `conceptOfTheDay(concepts,
  now)` → un concept **avec visuel** mis en avant par jour, rotation déterministe sur tout le corpus
  (identique le même jour pour tout le monde, différent le lendemain). Aucune donnée personnelle.
- **Accueil** : carte « 💡 Concept du jour » (bordure `advanced`) sous la mission — `MiniVisual` du
  concept + définition courte + lien « Découvrir la fiche › » vers `/concept/[slug]`. Hook de
  rétention **et** signal visuel supplémentaire.
- **8 nouveaux badges** (`badges.ts`) adossés aux stats déjà persistées : `streak-7`, `climber`
  (niveau 5), `devoted` (500 XP), `treasurer` (200 pièces) ; `curious-plus` (25 concepts),
  `world-tour` (15 mondes), `sharp-eye` (30 figures), `flawless-reco` (série de reconnaissance ≥ 8).
  Tous récompensent la régularité / le savoir / la diversité, **jamais un pari**.

## Conséquences

- Un concept illustré différent chaque jour sur l'accueil ; **15 → 23 badges** répartis
  progression / compréhension. Le compteur `x/N` et les capacités offline suivent
  `BADGES.length` dynamiquement (aucune régression).
- Gate verte : lint · typecheck · **415 tests** (+5, `conceptOfTheDay.test`) · validate:content 31 ·
  release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : accueil « Concept du jour »
  (Avalement haussier + visuel + lien fiche), Réussites « 0/23 » avec les nouveaux badges, **0 erreur
  console**.

## Rollback

Réversible : retirer la carte « Concept du jour » et le module, et retirer les badges ajoutés (les
tests ne vérifient que des ids précis + `BADGES.length` dynamique). Aucun changement de schéma ni de
persistance.
