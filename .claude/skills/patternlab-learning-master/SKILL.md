---
name: patternlab-learning-master
description: Auditer, simplifier et développer de bout en bout l’application PatternLab du dépôt Mendestrading21/TradeMy. Utiliser ce skill pour faire évoluer l’architecture pédagogique, les écrans Expo/React Native, les leçons, quiz, glossaire, graphiques interactifs, indicateurs, progression, révisions, abonnement et animations de Toto/Bobo, avec un lot testé à la fois sans réécrire inutilement l’existant.
---

# PatternLab Learning Master

## Mission

Transformer le dépôt existant en une application mobile d’apprentissage financier claire, visuelle et addictive au bon sens du terme : quelques minutes par jour, une progression compréhensible, beaucoup d’interactions, aucune apparence de plateforme de trading ni de bibliothèque passive.

Préserver Expo, React Native, TypeScript strict, Expo Router, les moteurs purs, le design system, la persistance locale, l’offline, les tests et les visuels SVG tant qu’une preuve concrète ne justifie pas leur remplacement.

## Contraintes produit non négociables

- Conserver une application autonome ; WMB reste une source éditoriale, jamais une dépendance runtime.
- Ne jamais importer comptes, emails, mots de passe, abonnements, paiements, secrets ni données personnelles de WMB.
- Maintenir une posture éducative : aucun ordre, signal, portefeuille réel, promesse de gain ou conseil personnalisé.
- Conserver Toto, taureau vert, et Bobo, ours rouge, comme guides pédagogiques complémentaires.
- Concevoir mobile-first, iOS/Android/web, hors-ligne d’abord, cinq onglets maximum.
- Ne pas copier l’apparence de Duolingo. Reprendre seulement ses principes utiles : objectif clair, petite étape, réponse immédiate, maîtrise et retour quotidien.
- Une visite de fiche ne vaut jamais maîtrise. Une compétence se valide par compréhension démontrée puis révision.
- Un seul abonnement au lancement ; ne pas créer deux formations concurrentes.
- Ne pas pousser, fusionner, déployer, publier ni activer un achat réel sans autorisation explicite.

## Références à charger

Lire uniquement celles nécessaires au lot :

- État réel et audit page par page : `references/01-audit-repository.md`.
- Vision, navigation et boucle quotidienne : `references/02-product-trajectory.md`.
- 15 mondes, dépendances et règles de maîtrise : `references/03-learning-architecture.md`.
- Modèle éditorial, Dividende, PER, RSI, MACD et catalogue : `references/04-content-catalog.md`.
- Contrats précis des écrans et textes : `references/05-ux-page-blueprints.md`.
- Graphiques, indicateurs, modes interactifs et accessibilité : `references/06-graphics-and-lab.md`.
- Rôles, états et animations de Toto/Bobo : `references/07-toto-bobo-system.md`.
- Ordre d’exécution, migrations et lots : `references/08-engineering-roadmap.md`.
- Critères de validation et de livraison : `references/09-acceptance-checklist.md`.

## Protocole de démarrage obligatoire

1. Lire `AGENTS.md` s’il existe, `CLAUDE.md`, `README.md`, `package.json`, `docs/PROJECT_STATUS.md`, les ADR concernés et le skill actif du dépôt.
2. Inspecter `git status`, la branche, les changements utilisateur et les derniers commits. Ne jamais écraser une modification non liée.
3. Cartographier les routes, sources de contenu, moteurs, persistance, analytics, premium, personnages, tests et scripts.
4. Vérifier les chiffres par le code. Ne jamais recopier un nombre ancien depuis la documentation.
5. Exécuter la baseline canonique avec `npm run check`. Distinguer clairement « vérifié maintenant » de « indiqué dans la documentation ».
6. Comparer le dépôt à `references/01-audit-repository.md`. Mettre l’audit à jour si le code a évolué.
7. Présenter un plan exécutable centré sur un résultat utilisateur, les fichiers touchés, les migrations, les tests et les risques.
8. Si la demande inclut l’implémentation, poursuivre avec le premier lot cohérent après le plan ; ne pas s’arrêter à une liste d’idées.

## Ordre de décision

Pour chaque proposition, privilégier dans cet ordre :

1. compréhension de l’utilisateur ;
2. cohérence du parcours d’apprentissage ;
3. correction des données et de la progression ;
4. interaction utile ;
5. accessibilité et robustesse ;
6. qualité visuelle ;
7. quantité de contenu.

Refuser l’ajout d’une carte, d’un badge, d’un graphique ou d’une animation sans fonction pédagogique identifiable.

## Architecture cible unique

```text
Parcours
└── Monde
    └── Module
        └── Compétence
            ├── Concepts
            ├── Leçon guidée
            ├── Pratique
            ├── Checkpoint
            └── Révision espacée
```

Utiliser cette hiérarchie déjà en place comme source de vérité pour les routes, verrous, statistiques et contenus. Ne pas recréer un second parcours concurrent.

## Navigation cible

Conserver cinq onglets : `Accueil`, `Parcours`, `Apprendre`, `Réviser`, `Profil`.

- `Accueil` : une action principale et un aperçu compact.
- `Parcours` : chemin pédagogique et mondes.
- `Apprendre` : bibliothèque, glossaire, quiz visuel, leçons libres et laboratoire.
- `Réviser` : rappels dus, erreurs et deck adaptatif.
- `Profil` : progression, statistiques, préférences, abonnement et légal.

Le Laboratoire ne doit plus occuper seul un onglet principal. Il devient une modalité forte du hub `Apprendre` et des leçons.

## Boucle d’apprentissage canonique

Construire chaque session comme une succession d’écrans courts :

1. objectif en une phrase ;
2. observation visuelle ;
3. hypothèse de Toto et mise en garde de Bobo ;
4. explication concise ;
5. manipulation ;
6. deux à cinq questions variées ;
7. contre-exemple ou faux signal ;
8. résumé de maîtrise ;
9. prochaine révision.

Ne jamais rendre toute une leçon longue dans un seul écran défilant. Un écran = une décision ou une idée principale.

## Règles de contenu

- Chaque concept riche possède un objectif, une définition courte, une explication, un visuel, une interaction, des limites, un contre-exemple, des questions, des flashcards, des relations et des sources.
- Promouvoir les termes simples importants vers des fiches riches. `Dividende` et `PER` sont prioritaires.
- Conserver les fiches RSI, MACD et Bollinger existantes, puis leur ajouter des laboratoires paramétrables et des questions visuelles.
- Marquer tout nouveau contenu `needsReview` jusqu’à validation humaine.
- Ne jamais gonfler artificiellement le compteur de concepts. Une entrée incomplète n’est pas un concept publié.

## Règles d’interface

- Une action primaire par écran ; deux maximum pendant un exercice.
- Questions principalement par gros boutons, choix visuels, classement, association ou manipulation. Toujours fournir une alternative accessible aux gestes.
- Afficher la raison d’un verrou et la prochaine action permettant de l’ouvrir.
- Retirer les sections décoratives et les doublons avant d’ajouter des cartes.
- Tout bouton visible fonctionne. Une fonction future est décrite dans le plan, pas affichée comme bouton désactivé permanent.
- Afficher des états loading, vide, erreur, offline, verrouillé, premium et reduced-motion.

## Règles pour Toto et Bobo

- Toto formule l’hypothèse optimiste ; Bobo vérifie le risque, l’invalidation et le faux signal.
- Leur dialogue doit faire avancer la compréhension, jamais seulement féliciter.
- Utiliser une animation contextuelle courte avec entrée, geste, regard/pointage et sortie. Éviter le flottement infini uniforme.
- Respecter `prefers-reduced-motion` et le réglage natif.
- Réutiliser les assets 3D transparents cohérents. Ne pas mélanger styles, proportions ou noms.

## Cycle d’implémentation par lot

1. Choisir le plus petit lot produisant un flux complet visible.
2. Écrire ou ajuster les tests purs avant le câblage UI lorsque la logique change.
3. Ajouter une migration non destructive si le modèle persistant change.
4. Implémenter les données, puis les moteurs, puis les écrans.
5. Vérifier les routes, les textes, les états et l’accessibilité.
6. Exécuter la gate complète.
7. Piloter réellement les flux touchés aux largeurs 320, 390 et 430 px ; vérifier console et clavier web.
8. Documenter les décisions et mettre à jour les chiffres dérivés.
9. Produire un rapport factuel. Ne jamais annoncer un test ou un appareil non vérifié.

## Gate obligatoire

```bash
npm run check
```

Ajouter les tests ciblés du lot et un contrôle de dérive documentaire. Pour les changements natifs, compléter par iOS et Android réels ou annoncer explicitement la limite.

## Définition de terminé

Un lot est terminé seulement si le flux est utilisable de bout en bout, sans route de secours silencieuse ni bouton mort ; la progression reflète une action d’apprentissage réelle ; le contenu a une source et un statut ; les visuels ont une alternative textuelle ; les migrations préservent les données ; les commandes de qualité passent ; les écrans ont été parcourus ; la documentation correspond au code.

## Format de rapport

```text
LOT : [nom]
Résultat utilisateur :
État avant / après :
Fichiers et migrations :
Contenu / visuels ajoutés :
Routes vérifiées :
Tests et builds :
Vérification écran / a11y :
Limites réelles :
Prochain lot recommandé :
```
