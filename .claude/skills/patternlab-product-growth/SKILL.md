---
name: patternlab-product-growth
description: Transforme PatternLab en application premium d'apprentissage visuel des marchés : stratégie produit, UX, design system, moteur pédagogique, graphiques interactifs, contenu, gamification, monétisation et livraison par lots.
---

# PatternLab — Product Growth Skill

## Mission

Faire évoluer l'application existante `Mendestrading21/patternlab` en produit mobile éducatif premium, immersif, interactif, accessible et commercialisable, sans recréer une application parallèle.

Le dépôt `Mendestrading21/APP` est une source éditoriale pour les contenus historiques WMB. Il ne doit jamais devenir une dépendance runtime de PatternLab.

Promesse centrale :

> Apprends à lire un graphique en cinq minutes par jour.

## Positionnement absolu

PatternLab est une application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un risque de perte.

PatternLab n'est jamais :

- un courtier ;
- une application de signaux ;
- un terminal de trading ;
- un portefeuille réel ;
- un casino ;
- un réseau social spéculatif ;
- une promesse de gains.

Utiliser lorsque pertinent :

- setup haussier ;
- setup baissier ;
- entrée théorique ;
- zone de confirmation ;
- invalidation ;
- objectif pédagogique ;
- faux signal ;
- scénario éducatif.

Éviter :

- BUY ;
- SELL ;
- signal sûr ;
- profit garanti ;
- trade gagnant ;
- liberté financière garantie.

## Identité produit

- Marque : **PatternLab**.
- Toto : taureau vert, enthousiaste et curieux ; il formule une hypothèse haussière sans promettre une hausse.
- Bobo : ours rouge, prudent et analytique ; il recherche le risque, le faux signal et l'invalidation sans promettre une baisse.
- Public initial : débutants, étudiants, jeunes actifs, investisseurs particuliers et utilisateurs intermédiaires qui révisent leurs bases.
- Ton : français naturel, adulte, clair, sérieux, encourageant, jamais infantilisant.

## Règles de travail

1. Auditer l'état réel du dépôt avant toute décision.
2. Comparer code, derniers commits, tests et documentation ; le code exécuté fait foi.
3. Préserver le travail utilisateur et les changements non commités.
4. Ne jamais effectuer de reset destructif ni réécrire l'historique.
5. Travailler par lots fonctionnels petits, vérifiables et réversibles.
6. Un écran visible doit fonctionner, être clairement verrouillé ou expliquer son indisponibilité.
7. Ne jamais produire uniquement une galerie de maquettes.
8. Ne pas ajouter un backend, une dépendance ou un service avant d'établir le besoin.
9. Les moteurs pédagogiques et graphiques doivent être indépendants du contenu.
10. Tout contenu importé ou généré automatiquement reste `draft` ou `needsReview` jusqu'à validation humaine.
11. Ne jamais importer de comptes, emails, mots de passe, secrets, Stripe, abonnements ou données personnelles depuis WMB/APP.
12. Ne jamais connecter un compte de courtage ou exécuter une transaction.
13. Ne jamais pousser, publier ou ouvrir une PR sans demande explicite.
14. Respecter reduced motion, contraste AA, lecteurs d'écran, navigation clavier web et alternatives aux gestes.
15. Une compétence ne devient pas maîtrisée après une seule bonne réponse.

## Références à charger selon la tâche

Toujours lire `reference/01-product-strategy.md`.

Puis charger uniquement les documents utiles :

- Refonte visuelle, navigation, écrans, Toto/Bobo : `reference/02-design-learning-system.md`
- Exercices, leçons, maîtrise, graphiques, laboratoire : `reference/03-interactive-product.md`
- Import APP, taxonomie, 500+ concepts, validation éditoriale : `reference/04-content-factory.md`
- Tests, Git, CI, audits, documentation : `reference/05-quality-delivery.md`
- Prix, paywall, analytics, rétention, croissance : `reference/06-business-growth.md`
- Priorités et lots : `reference/07-roadmap.md`

Workflows :

- Audit ou demande de plan sans modification : `workflows/audit-and-plan.md`
- Exécution d'un lot avec modifications : `workflows/execute-lot.md`

Le skill `patternlab-full-launch` reste la référence pour les sujets de fondation Expo, builds internes, EAS, TestFlight, Google Play et lancement stores. Ne duplique pas inutilement ses règles.

## Architecture produit cible

```text
LearningPath
  World
    Module
      Skill
        Concept
          Lesson
            Step
            Interaction
            Exercise
            Feedback
            Flashcard
            Review
            Assessment
```

Séparer strictement :

- XP = activité ;
- mastery = compétence réelle ;
- confidence = stabilité ;
- reviewDueAt = prochaine révision ;
- streak = régularité ;
- coins = récompenses internes ;
- errorTags = erreurs récurrentes.

## Boucle quotidienne cible

1. Observation d'un graphique.
2. Hypothèse ou question.
3. Explication courte.
4. Manipulation réelle.
5. Exercices adaptatifs.
6. Faux signal ou contre-exemple.
7. Résultat de maîtrise.
8. XP et récompense.
9. Révision planifiée.

Durée cible : trois à sept minutes, cinq minutes par défaut.

## Ordre de priorité

1. Fiabilité de la progression et des XP.
2. Design system neutre premium.
3. Onboarding personnalisé.
4. Accueil centré sur la mission du jour.
5. Parcours immersif.
6. Leçons V2.
7. Exercices interactifs.
8. Laboratoire de graphiques.
9. Maîtrise et répétition espacée.
10. Migration progressive du contenu APP.
11. Monétisation, analytics, offline et préparation bêta.

## Validation obligatoire après modification

Exécuter lorsque les scripts existent :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

Pour un écran ou une interaction, ajouter une vérification réelle du rendu mobile/web et des erreurs console. Ne jamais annoncer une vérification visuelle non effectuée.

## Format de restitution

Après un audit :

- état réel ;
- écarts documentation/code ;
- problèmes prioritaires ;
- plan par lots ;
- fichiers exacts ;
- critères d'acceptation ;
- risques ;
- décisions nécessaires.

Après un lot exécuté :

- problème corrigé ;
- comportement livré ;
- fichiers modifiés ;
- tests exécutés et résultats ;
- vérification visuelle ;
- commit local éventuel ;
- limites restantes ;
- prochain lot recommandé.

## Définition globale de qualité

Un changement PatternLab est acceptable lorsqu'il est :

- utile à l'apprentissage ;
- cohérent avec la promesse produit ;
- réellement interactif lorsque nécessaire ;
- extensible à 500+ concepts ;
- accessible ;
- testé ;
- documenté ;
- sans bouton mort ;
- sans donnée inventée ;
- sans conseil financier ;
- réversible.
