# 05 — Système d’animation

## Objectif

Apporter de l’émotion sans ralentir l’apprentissage.

## Couches

### UI

- transitions de cartes ;
- progression ;
- XP ;
- sélection de réponse ;
- feedback ;
- niveau supérieur ;
- navigation.

Utiliser Reanimated lorsque compatible.

### Personnages

Créer une abstraction `CharacterAnimationController`.

États :

- idle
- wave
- explain
- inspect
- think
- agree
- disagree
- encourage
- celebrate-small
- celebrate-big
- warning
- wrong
- confused
- debate
- streak
- level-up
- rest
- offline
- loading

Évaluer :

- Rive avec machine d’états ;
- Lottie ;
- sprites optimisés ;
- animations natives simples.

Documenter le choix dans ADR-005.

## Matrice des déclencheurs

- bonne réponse : petite célébration ;
- série de bonnes réponses : duo Toto/Bobo ;
- mauvaise réponse : empathie puis explication ;
- risque oublié : Bobo avertit ;
- hypothèse trop prudente : Toto invite à observer ;
- niveau supérieur : scène duo ;
- inactivity : idle discret ;
- offline : scène dédiée ;
- réduction d’animation : image statique + fondu minimal.

## Performance

- 60 FPS cible ;
- pas d’animation lourde pendant interaction graphique ;
- préchargement ;
- assets compressés ;
- mémoire testée sur appareils modestes ;
- animations interrompables.
