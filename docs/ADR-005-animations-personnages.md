# ADR-005 — Animations des personnages (Toto & Bobo)

## Statut
Accepté (P0.1) — technologie retenue : **Lottie**.

## Contexte
Toto et Bobo doivent posséder un système d'états (idle, explain, celebrate, warning…),
courts, contextuels, désactivables et compatibles « réduire les animations ». Le kit
demande de trancher entre Rive, Lottie et sprites dans un ADR avant adoption.

## Options
- **Lottie** (`lottie-react-native`) : vectoriel, léger, outillage designer répandu.
- Rive + machine d'états : très expressif, plus lourd à produire/intégrer.
- Sprites / animations natives simples.

## Décision
**Lottie** (choix utilisateur). La dépendance `lottie-react-native` est installée.
L'intégration passe par un point unique, `CharacterAnimationController`, qui expose une
API stable `{ character, state, size }` aux écrans.

**État P0.1** : l'art Lottie de Toto/Bobo n'existe pas encore. Le contrôleur rend donc
un **avatar SVG** stylisé (fidèle aux planches : taureau vert / ours rouge) avec des
micro-animations Reanimated. Brancher Lottie = remplacer le rendu dans le contrôleur
par le lecteur Lottie, **sans changer les écrans**.

## Conséquences
- Le pipeline (dépendance + point d'intégration) est prêt.
- Prochaine tâche asset : produire les fichiers Lottie par état (fournis ou générés).
- L'accessibilité est respectée : rendu statique si « réduire les animations » est actif.

## Rollback
L'API du contrôleur étant stable, revenir au SVG (ou passer à Rive) n'impacte pas les écrans.
