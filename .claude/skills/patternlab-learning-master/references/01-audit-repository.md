# Audit du dépôt PatternLab — baseline du 21 juillet 2026

> **Baseline historique, pas état courant.** Les problèmes décrits ici ont servi à construire les
> lots 0 à 10 et plusieurs sont désormais corrigés. Avant toute décision, consulter
> `docs/CURRENT_STATE.md`, `docs/PROJECT_STATUS.md` et le code. Le dépôt canonique actuel est
> `Mendestrading21/TradeMy`.

## Source et niveau de confiance

Audit initialement établi quand le dépôt était encore référencé sous `Mendestrading21/patternlab`,
branche `main`, commit `902e4dd83972219ba800714af8901555f4f1c168` du 21 juillet 2026.

La documentation et les messages de commit annoncent une gate verte de 417 tests, 31 validations de contenu, 14 contrôles release et un build web réussi. Ces résultats n’ont pas été reproduits localement pendant l’audit ; les traiter comme déclarés par le dépôt jusqu’à nouvelle exécution.

## État technique réel

- Expo SDK 57, React Native 0.86, React 19.2, TypeScript strict, Expo Router.
- Reanimated, Lottie, SVG, AsyncStorage, web statique.
- CI : lint, typecheck, Jest, validation éditoriale, build web.
- 15 mondes enregistrés.
- 58 concepts riches V5.
- 24 termes historiques de glossaire.
- 4 compétences runtime : action, tendance, chandeliers, figures.
- 15 leçons dans `seed.ts`.
- 28 exercices dans `seed.ts`.
- 16 types déclarés, 13 graders réellement enregistrés.
- 23 badges documentés.
- Premium, analytics et achats encore simulés/local-first.

## Ce qui est déjà bon

1. Stack moderne et adaptée à iOS, Android et web.
2. Architecture logique généralement pure et testable.
3. Très bonne posture de conformité éducative.
4. Visuels SVG déterministes, sans dépendance à des captures externes.
5. Répétition espacée, maîtrise, historique d’erreurs et migrations déjà amorcés.
6. Glossaire avec recherche tolérante, favoris et récents.
7. Accessibilité prise en compte : contraste, cibles, résumés graphiques, reduced motion.
8. Toto et Bobo ont une identité fonctionnelle distincte.
9. Le contenu WMB est isolé comme source éditoriale et les données personnelles sont exclues.

## Problèmes structurants prioritaires

### P0 — Deux parcours concurrents

`src/app/(tabs)/parcours.tsx` affiche d’abord le trail pilote de 4 compétences et un checkpoint, puis une seconde carte de 15 mondes. L’utilisateur doit comprendre deux modèles de progression différents sur la même page.

Correction : convertir les 4 compétences pilotes en premier module du premier monde, puis utiliser une seule hiérarchie monde → module → compétence.

### P0 — Les 15 mondes sont davantage un catalogue qu’un parcours

Un monde ouvre seulement son premier concept. Le déblocage du monde suivant se fait dès qu’un concept du précédent est ouvert. Un monde est « terminé » lorsque toutes ses fiches ont été visitées. Cela mesure la navigation, pas l’apprentissage.

Correction : créer une route de détail du monde, des modules, des compétences, des checkpoints et des règles basées sur maîtrise + rappel, non sur simple consultation.

### P0 — Densité de l’accueil

L’accueil cumule mission, progression, concept du jour, révisions, quêtes, six entrées Explorer, deux mascottes et disclaimer. La mission quotidienne n’est plus le centre visuel incontestable.

Correction : garder mission, progression compacte, révision due et concept du jour. Déplacer quêtes et catalogue dans Apprendre/Réussites.

### P0 — Le flux de leçon n’est pas réellement séquencé

La phase `learn` de `src/app/session/[skillId].tsx` rend tous les steps de la première leçon sur une seule page défilante avant les exercices.

Correction : un step par écran avec progression, retour, CTA unique et état persistant. Insérer manipulation et vérification entre les explications.

### P1 — Écart contenu/parcours

Le dépôt contient 58 concepts riches mais seulement 4 compétences, 15 leçons et 28 exercices. La majorité de la bibliothèque ne participe pas à un chemin de maîtrise.

Correction : relier chaque concept à une compétence, une leçon, une pratique et une révision ; ne pas créer immédiatement 500 concepts orphelins.

### P1 — Termes importants encore passifs

`Dividende` et `PER` existent déjà dans `src/data/glossary.ts`, avec définitions et relations, mais pas comme concepts riches illustrés. RSI, MACD et Bollinger ont déjà des fiches V5 et des visuels.

Correction : promouvoir Dividende et PER en `LearningConcept` interactifs ; enrichir les indicateurs existants au lieu de les dupliquer.

### P1 — Incohérence du moteur d’exercices

Le commentaire parle de 12 formats, la liste en déclare 16, l’union rendable en supporte 13. `drag_drop`, `draw_level` et `timed` sont déclarés mais sans grader ni renderer canonique.

Correction : source unique `EXERCISE_FORMAT_REGISTRY` décrivant type, grader, renderer, accessibilité, statut et exemples. Retirer les nombres écrits à la main.

### P1 — Route de secours trompeuse

Une route de session inconnue retombe silencieusement sur `skill.actions`.

Correction : afficher un état « session introuvable », journaliser l’erreur et proposer Parcours. Ne jamais enseigner un autre contenu sans le dire.

### P1 — Bouton fonction future visible

Le Laboratoire montre `Zones, lignes de tendance & annotations` désactivé. Cela contredit l’affirmation « zéro bouton mort ».

Correction : implémenter la fonction ou retirer l’action et la garder dans la roadmap.

### P1 — Progression trop facile à gonfler

Ouvrir une fiche marque automatiquement concept et monde comme explorés. Les statistiques mélangent découverte et compréhension.

Correction : séparer `viewed`, `practiced`, `understood`, `strong`, `mastered`. Afficher ces mots avec précision.

### P1 — Premium non prêt à être vendu

Le paywall est une simulation locale, sans achat, restauration réelle, authentification ni synchronisation. La release peut être techniquement verte tout en restant non commercialisable.

Correction : garder le mode démo explicitement en développement ; préparer un provider d’entitlement et n’activer un achat réel qu’avec comptes et autorisation.

### P2 — Animations encore limitées

Les mascottes utilisent surtout des images 3D transparentes animées par translation, rotation, respiration et scale. Lottie est installé mais aucun corpus d’animations complet n’est prouvé. Les répliques ont 3–4 variantes et restent génériques.

Correction : orchestrer des moments contextuels, pointer les zones du graphique, varier regard/entrée/sortie et relier les dialogues aux erreurs conceptuelles.

### P2 — Documentation contradictoire

`PROJECT_STATUS.md` contient les lots récents, mais conserve des sections anciennes parlant d’un seul monde, de 8 leçons, de 20 exercices et de formats « à venir » déjà livrés. Les commentaires de types restent datés de P0.1.

Correction : générer les compteurs depuis le code et archiver les statuts historiques hors du résumé courant.

## Audit page par page

| Écran | État actuel | Problème principal | Trajectoire cible |
|---|---|---|---|
| Splash/onboarding | Profil riche en 7 étapes et diagnostic | Trop long avant première victoire ; diagnostic peu visuel | Première interaction en moins de 60 s, 4–5 étapes, mini-graphique et leçon immédiate |
| Accueil | Fonctionnel, complet, 6 raccourcis | Surcharge et concurrence des CTA | Mission dominante + 3 blocs compacts |
| Parcours | Trail 4 compétences + 15 mondes | Deux architectures et progression par visite | Un seul chemin, route Monde, modules et checkpoints |
| Leçons | Liste par 4 compétences | Catalogue étroit et dissocié des mondes | Intégré à Apprendre et au chemin de chaque monde |
| Session | Leçon complète puis exercices | Scroll long, pas de stepper, fallback silencieux | Un écran par étape, remédiation et reprise |
| Quiz éclair | Démo d’une seule compétence | Peu personnalisé et affiche trop de préambule | Quiz selon monde, objectif et erreurs |
| Quiz visuel | 3 difficultés, familles, 8 rounds | Très bon socle ; feedback encore générique | Explication annotée et adaptation aux erreurs |
| Glossaire | Recherche, catégories, favoris, récents | Fiches riches non systématiques | Catalogue visuel avec statut d’apprentissage |
| Fiche concept | Définition, scénarios, visuel, flashcard | Long scroll ; flashcard déjà révélée ; peu d’action | Onglets/sections progressives, manipulation, pratique liée |
| Bibliothèque visuelle | Filtres direction + galerie SVG | Peu navigable, pas de recherche/favoris, pas de fiche directe | Recherche par famille/niveau, cartes ouvrables, comparaison |
| Laboratoire | Support + replay volume | Seulement 2 scénarios ; action future désactivée | Catalogue de labs intégrés aux concepts et indicateurs |
| Révisions | Dues, maîtrise, erreurs, deck premium | Erreurs identifiées par exercice plutôt que concept | Deck adaptatif par misconception, mode rapide 3–5 min |
| Résultats | Score, XP, précision, mascottes | Tuiles génériques ; « série » = emoji sans valeur | Maîtrise gagnée, erreurs clés, prochaine révision |
| Statistiques | Vue 7 jours, maîtrise, erreurs | Seulement 4 skills ; détail premium simulé | Vue par monde/compétence, exactitude des statuts |
| Profil | Très complet | Page longue de réglages et promotions | Sections compactes : progression, préférences, abonnement, légal |
| Réussites | 23 badges, séries | Grille passive ; célébration différée | Toast/modal d’obtention et explication du prochain objectif |
| Premium | Démo claire | Non commercialisable | Une offre unique, entitlement réel ultérieur, aucun dark pattern |

## Verdict

PatternLab n’a pas besoin d’une nouvelle refonte technique. Il a besoin d’une consolidation produit : une seule trajectoire, des leçons vraiment séquencées, des mondes fondés sur la maîtrise, une bibliothèque transformée en exercices et une interface plus calme. Le socle est assez fort pour cela.
