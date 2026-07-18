# ADR-016 — Toto/Bobo V2 (registre d'états, fréquence, reduced motion)

## Statut
Accepté (LOT 10 — Toto/Bobo V2, skill `patternlab-product-growth`).

## Contexte
Les personnages avaient un `CharacterState` et une table `STATE_TO_EXPRESSION` ad hoc,
sans métadonnée centralisée, sans liste canonique complète, et sans règle de présence
(les mascottes doivent être **discrètes** dans les listes denses, les réglages et les
interactions graphiques précises). Le skill demande : registre d'états, états complets,
fréquence contrôlée et compatibilité reduced motion.

## Décision
1. **Registre d'états canonique** `CHARACTER_STATES` (`states.ts`) — **source unique** :
   chaque état porte `expression`, `defaultCharacter`, `category`, `intensity` et un
   `tone`. La liste couvre les états du skill (idle, welcome, explain, observe, think,
   debate, encourage, confused, warning, wrong, false-signal, level-up, streak, review,
   rest, loading, offline, premium…). `STATE_TO_EXPRESSION` en est **dérivé** (plus de
   duplication) ; `mascotFor(state, character?)` résout personnage + expression + ton.
2. **Intensité d'animation** pilotée par le registre (`still`/`subtle`/`lively`) dans le
   `CharacterAnimationController`, toujours **désactivée si reduced motion** (inchangé).
3. **Gouverneur de fréquence** `frequency.ts` (pur, testé) : `mascotPresence(context)` →
   `full` / `compact` / `hidden`. `hidden` pour `denseList`, `settings`, `chartPrecise` ;
   `compact` pour `home`, `review` ; `full` ailleurs. Appliqué dans Révisions (une seule
   mascotte compacte, sans nom).
4. **Nouveaux états câblés** : `welcome` (onboarding), `false-signal` (labo), `review`
   (Révisions).

## Conséquences
- Une seule table pilote expression, personnage par défaut et animation.
- Les mascottes restent utiles là où il faut et discrètes ailleurs.
- Base prête pour l'art Lottie (ADR-005) : le renderer changera sans toucher au registre.

## Rollback
Le registre est additif ; revenir à l'ancienne table = réexporter `STATE_TO_EXPRESSION`
statique. Le gouverneur de fréquence et les nouveaux états sont indépendants.
