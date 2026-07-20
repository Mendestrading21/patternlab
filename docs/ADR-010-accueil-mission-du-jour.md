# ADR-010 — Accueil « mission du jour »

## Statut
Accepté (LOT 4 — Accueil mission du jour, skill `patternlab-product-growth`).

## Contexte
Le Lot 2 avait recentré l'accueil sur une mission unique ; le Lot 3 a introduit un
profil (objectif, niveau, temps 3/5/10 min, sujets). Le Lot 4 doit livrer la
composition complète de l'accueil : **CTA principal exploitant le profil**, **révision
due**, **progression compacte**, en réduisant l'empilement décoratif (règles DS du skill :
une priorité par écran, moins de cartes/décoration).

## Décision
1. **Le temps quotidien pilote la longueur de session.** Fonction pure
   `exercisesForMinutes` (3→3, 5→5, 10→8) + `limitCount` (borne [1, disponible]),
   testées. L'écran de session lit un paramètre `count` (facultatif, rétrocompatible)
   et tronque la liste d'exercices en conséquence.
2. **CTA principal personnalisé.** La mission du jour route vers
   `/session/[skillId]?count=exercisesForMinutes(temps)`, tant depuis l'accueil que
   depuis la fin de l'onboarding. Le sous-titre d'accueil affiche l'objectif et le
   temps du profil ; la carte mission montre `~N min` et `N exercices`.
3. **Progression compacte** (niveau, série, pièces, barre d'XP) intégrée à la carte
   mission, subordonnée au CTA.
4. **Révision due** : pointeur compact vers l'onglet Révisions (dû / à jour).
5. **Allègement** : suppression de la section décorative « Les 4 piliers » de l'accueil
   (redondante) ; conservation des Défis, de l'Explorer (accès Leçons/Quiz/Glossaire/
   Réussites) et d'une carte Conseils Toto/Bobo.

## Conséquences
- Le profil influence enfin le comportement (durée de session), pas seulement l'affichage.
- Accueil plus lisible, une seule action mise en avant.
- Rétrocompatible : sans profil, temps par défaut 5 min ; sans `count`, session complète.
- Tests : `exercisesForMinutes`, `limitCount`.

## Rollback
Retirer le paramètre `count` (la session rejoue tout) et restaurer la section piliers ;
`sessionPlan` est additif et sans effet de bord.
