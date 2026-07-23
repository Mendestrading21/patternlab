# ADR-095 — Toto/Bobo : système d'orchestration événement → état + motion (LOT 2)

## Statut

Accepté — 2026-07-23. Branche `feat/trademy-toto-bobo-motion-system` (base : `main` avec P0
fusionné, ADR-092/093/094). Prolonge ADR-085 (états & animations). Aucune dépendance ajoutée.
Sources : `docs/product/TOTO_BOBO_CANON.md`, `src/characters/`, `src/design-system/tokens.ts`.

## Contexte

Le système de mascottes était déjà mûr avant ce lot (registre `CHARACTER_STATES`, contrôleur
d'animation avec pop ponctuel + rendu statique sous `prefers-reduced-motion`, `CharacterScene`,
dialogue contextuel `characterLine`/`mistakeMoment`, présence sur tous les écrans). Conformément à
la **règle d'arrêt** du lot (« si les états sont déjà plus avancés que le prompt, ne pas
reconstruire »), l'existant a été **audité et conservé**, et seules les **lacunes démontrées** ont
été comblées :

1. Les états ne portaient pas leurs **métadonnées d'orchestration** (déclencheur, priorité, durée en
   token motion, interruptible, retour-à-idle, texte accessible, haptique optionnelle).
2. Aucun **modèle d'événements pédagogiques typé** ne pilotait les mascottes ni n'arbitrait deux
   réactions concurrentes (ex. une célébration vs un événement système).
3. L'échelle **motion** n'était pas normée (paliers instant/fast/standard/expressive/celebration).
4. Pas de **carte de choix de guide** (Toto/Bobo) accessible, ni de préférence persistée.
5. La décision de mouvement (reduced-motion, pop, boucle) vivait uniquement dans le composant
   (Reanimated) : **non testable** par les tests purs du dépôt.

## Options

- **A — Reconstruire** un nouveau système d'animation (Rive/Lottie ou moteur maison). Rejeté :
  dépendance non justifiée, casse de l'existant mûr, contraire à la règle d'arrêt.
- **B — Étendre l'existant** : enrichir le registre, ajouter un orchestrateur pur, normer la motion,
  extraire un noyau de mouvement testable, brancher une réaction réelle. **Retenu.**

## Décision

1. **Registre enrichi (source unique)** — `CharacterStateSpec` porte désormais `trigger`, `priority`,
   `duration` (token motion), `interruptible`, `returnsToIdle`, `accessibleText`, `haptic?`, `audio?`
   (audio toujours absent par défaut). Priorités proportionnelles (repos 0 → guidance ~10 → débat 20 →
   feedback 35–45 → série 50 → grande célébration 60 → level-up 65 → **hors-ligne 90**). L'état
   `offline` porte **Bobo** (prudence/système) et est **non interruptible**.
2. **Échelle motion normée** (`design-system/tokens.ts`) : `instant` (≤120), `fast`, `standard`,
   `expressive`, `celebration` (≤1200), avec alias de compat. Vérifiée par test (ordre strict).
3. **Orchestrateur pur** (`characters/orchestrator.ts`) — `MascotEvent` typé (17 événements) →
   `resolveMascotState` (état + personnage + métadonnées) ; nuances : bonne réponse en série (≥3) →
   `streak` ; checkpoint échoué → `encourage` (jamais célébré) ; **reprise de session → `welcome`,
   jamais une célébration rejouée**. `pickReaction` arbitre la concurrence : une réaction non
   interruptible n'est écrasée que par une priorité **strictement** supérieure (ex. hors-ligne).
   L'orchestrateur **ne duplique pas le TEXTE** : la vérité pédagogique reste dans
   `characterLine`/`mistakeMoment`/le concept.
4. **Noyau de mouvement pur** (`characters/motionPlan.ts`) — `motionPlan(state, reduced)` :
   `static` sous reduced-motion, sinon `animated` avec `popScale` dosé par l'intensité (still = 1.0)
   et `loopFloat` **vrai uniquement pour idle**. Le contrôleur en dérive ses valeurs Reanimated et
   annule `scale` + `translateY` au démontage (aucun timer orphelin). Testable **sans Reanimated**.
5. **Pont événement → rendu** (`characters/MascotEventScene.tsx`) — rend la réaction d'un événement
   via l'orchestrateur ; **utilisé réellement** dans la session pour une **réaction hors-ligne
   additive** (Bobo, avatar vectoriel inline, aucun asset réseau), sans toucher la logique de
   progression P0.
6. **Carte de choix de guide** (`characters/GuideSelectionCard.tsx`) — groupe de boutons radio
   accessible (rôle radiogroup/radio, état sélectionné, focus clavier, libellé + indice lecteur
   d'écran ; la couleur n'est jamais l'unique signal : icône + « Choisi »). Rôles pédagogiques purs
   (`guideRoles.ts`). Préférence `guide?: 'toto' | 'bobo'` ajoutée au profil d'onboarding, avec
   **migration non destructive** (valeur inconnue → `undefined`, ancien profil sans guide → OK).

## Conséquences

- Les mascottes réagissent à un **modèle d'événements typé**, avec priorités qui empêchent deux
  réactions simultanées, et une **célébration proportionnelle** à l'événement.
- La règle **reduced-motion = statique**, l'échelle du pop et « seul idle boucle » sont désormais
  **prouvées par des tests purs** (`motionPlan.test.ts`), en plus de l'invariant de démontage.
- L'utilisateur peut **choisir son guide** (Toto/Bobo), choix persisté et non destructif.
- L'état **hors-ligne** est réellement rendu par une mascotte sans dépendre du réseau.
- **Aucune dépendance ajoutée** (Reanimated + SVG déjà présents). P0 intact (aucune modification de la
  logique de progression ; les suites P0 restent vertes).
- **Aucun vocabulaire interdit** : tests anti-BUY/SELL sur l'orchestrateur et les rôles de guide.

## Rollback

Lot purement additif côté personnages + un profil optionnel migré sans perte. Retirer la branche
restaure l'état post-P0. Le champ `guide` est optionnel et ignoré s'il est absent ; aucune donnée
persistée existante n'est invalidée.
