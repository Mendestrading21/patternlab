# Système Toto et Bobo

## Rôles

Toto, taureau vert : curiosité, hypothèse haussière conditionnelle, énergie, démonstration.

Bobo, ours rouge : prudence, contre-exemple, invalidation, risque, réassurance après erreur.

Ils ne sont ni ange/diable ni gagnant/perdant. Les deux ont raison selon le contexte.

## Orchestrateur recommandé

```ts
type MascotMoment = {
  id: string;
  context: 'onboarding' | 'lesson' | 'question' | 'feedback' | 'lab' | 'result';
  character: 'toto' | 'bobo' | 'duo';
  state: string;
  line: string;
  target?: 'chart' | 'answer' | 'progress' | 'risk-zone';
  entrance: 'slide' | 'pop' | 'peek' | 'none';
  gesture: 'point' | 'think' | 'nod' | 'warn' | 'celebrate' | 'walk' | 'idle';
  durationMs: number;
  priority: 1 | 2 | 3;
  reducedMotionFallback: 'static' | 'fade' | 'hidden';
};
```

Centraliser le contexte, la fréquence et les conflits. Une mascotte ne doit pas recouvrir un bouton, le graphique ou une réponse.

## États minimums

| Moment | Toto | Bobo |
|---|---|---|
| Bienvenue | wave/peek | observe |
| Observation | point/think | inspect |
| Hypothèse | explain/agrees | doubt |
| Bonne réponse | nod/small-celebrate | approve |
| Mauvaise réponse | encourage | explain-error |
| Série | celebrate | proud |
| Risque | listen | warning/point-risk |
| Faux signal | surprised | reveal-trap |
| Résultat parfait | big-celebrate | celebrate-duo |
| Révision | coach | review |

## Animation

- Entrée 180–300 ms, geste 400–900 ms, sortie 150–250 ms.
- Éviter une boucle permanente sur chaque écran.
- Le regard et le pointage doivent viser l’élément enseigné.
- Utiliser Reanimated pour placement, timing et transitions.
- Utiliser Lottie seulement avec des assets cohérents, légers et possédés/licenciés.
- Conserver un rendu statique premium si l’animation n’existe pas.

## Dialogues

- Relier la phrase au concept et à la misconception.
- Toto : « Le prix progresse, mais qu’est-ce qui confirmerait la tendance ? »
- Bobo : « Le dernier creux est cassé : ton hypothèse ne tient plus. »
- Éviter les banques de félicitations génériques trop répétées.
- Varier de façon déterministe et mémoriser les répliques récemment utilisées.

## Fréquence

- Plein écran : onboarding, hypothèse, feedback important, résultat.
- Compact : accueil, révision.
- Caché : listes denses, réglages, saisie graphique précise.
- Duo : débat, synthèse ou grande réussite uniquement.

## Assets

- Jeunes personnages 3D premium, proportions fixes, fond transparent.
- Même lumière, palette, contours et cadrage.
- Noms canoniques Toto/Bobo partout ; éliminer Toro/Bruno.
- Inventorier les assets réellement utilisés et retirer les références mortes après migration.

## Accessibilité et performance

- Le dialogue reste toujours du vrai texte.
- Une mascotte décorative est masquée aux technologies d’assistance.
- Respecter reduced motion et pause en arrière-plan.
- Précharger seulement les assets du moment suivant.
- Limiter poids, dimensions et animations simultanées.
