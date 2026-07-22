---
name: patternlab-v5-master
description: Skill maître pour auditer, planifier puis exécuter la montée en gamme complète de PatternLab : glossaire 500+, contenus, visuels SVG, chandeliers japonais, figures chartistes, graphiques interactifs, leçons, quiz, gamification, accessibilité, monétisation et qualité.
---

# PatternLab V5 — Master Product, Visual Learning & Execution Skill

## Mission

Transformer l’application existante `Mendestrading21/patternlab` en une plateforme éducative française premium, visuelle, interactive et extensible à plus de 500 concepts.

Ne jamais créer une application parallèle. Améliorer le dépôt existant par lots fonctionnels, testés, documentés et réversibles.

Le dépôt `Mendestrading21/APP` est une archive éditoriale WMB. Il sert de source de matière pédagogique, jamais de dépendance runtime et jamais de source de données personnelles.

Promesse centrale :

> Apprends à lire un graphique en cinq minutes par jour.

## Positionnement absolu

> Application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un risque de perte.

PatternLab n’est jamais :

- un courtier ;
- une application de signaux ;
- un service de copy trading ;
- un outil d’exécution d’ordres ;
- un portefeuille réel ;
- un casino ;
- une promesse de gains.

Vocabulaire recommandé :

- setup haussier ;
- setup baissier ;
- entrée théorique ;
- zone de confirmation ;
- invalidation ;
- objectif pédagogique ;
- faux signal ;
- scénario éducatif.

Vocabulaire interdit dans l’interface pédagogique :

- BUY ;
- SELL ;
- signal sûr ;
- profit garanti ;
- trade gagnant ;
- liberté financière garantie ;
- high probability présenté comme certitude.

## Mode V5 obligatoire : plan puis exécution

Sauf si le prompt contient explicitement `PLAN_ONLY`, appliquer ce workflow :

1. auditer l’état réel du dépôt ;
2. exécuter les validations de référence ;
3. créer un plan complet dans `docs/PATTERNLAB_V5_MASTER_PLAN.md` ;
4. afficher un résumé du plan ;
5. commencer immédiatement le Lot 0 ;
6. exécuter les lots dans l’ordre, un par un ;
7. terminer, tester et documenter chaque lot avant le suivant ;
8. créer un commit local par lot lorsque Git est disponible ;
9. ne jamais pousser ni ouvrir une PR sans autorisation explicite ;
10. en cas de limite de temps ou de contexte, s’arrêter à une frontière propre et créer `docs/PATTERNLAB_V5_CONTINUATION.md` avec la prochaine commande exacte.

Ne pas demander une validation intermédiaire pour les petites décisions techniques déductibles du code.

S’arrêter uniquement pour :

- une clé ou un secret externe ;
- un compte Apple/Google ;
- un paiement réel ;
- une suppression importante de données ;
- une décision juridique ou commerciale irréversible ;
- une publication distante ;
- un conflit avec du travail utilisateur impossible à résoudre sans choix humain.

## Règles Git et sécurité

Avant toute modification :

- lire la branche et `git status` ;
- préserver les changements utilisateur ;
- ne jamais effectuer de reset destructif ;
- ne jamais réécrire l’historique ;
- créer une branche dédiée, recommandée : `feature/patternlab-v5` ;
- un lot = un commit cohérent et réversible ;
- ne jamais inclure `.env`, tokens, exports utilisateurs, données Stripe, données clients ou secrets.

## Références à lire

Toujours lire :

- `references/01-product-vision.md`
- `references/08-roadmap-v5.md`
- `references/09-quality-compliance.md`
- `workflows/01-plan-then-execute.md`

Selon le chantier :

- design : `references/02-design-system.md`
- glossaire : `references/03-glossary-taxonomy.md`
- visuels : `references/04-visual-engine.md`
- graphiques : `references/05-interactive-chart-engine.md`
- leçons/jeu : `references/06-learning-game-system.md`
- import APP : `references/07-content-factory.md`
- images fournies : `references/10-reference-images.md`

## Architecture cible

```text
LearningPath
  World
    Module
      Skill
        Concept
          Lesson
            Step
            Visual
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
- coins = récompense interne ;
- attempts = historique ;
- errorTags = erreurs récurrentes.

## Principe visual-first

Chaque concept prioritaire doit pouvoir fournir :

- une carte visuelle ;
- un mini-chart ;
- une version annotée ;
- une comparaison ;
- une erreur fréquente ;
- un faux signal ;
- une interaction ;
- un mini-quiz ;
- une flashcard ;
- une description accessible.

Prioriser les visuels générés en code :

- SVG ;
- `react-native-svg` ;
- datasets OHLC déterministes ;
- composants paramétriques ;
- tokens sémantiques ;
- export PNG/WebP uniquement lorsque nécessaire.

Les images de référence incluses servent uniquement à comprendre la classification et la densité. Ne jamais copier leur mise en page, leur texte, leurs slogans, leurs labels BUY/SELL ou leurs promesses.

## Boucle quotidienne cible

1. mission du jour ;
2. observation d’un graphique ;
3. hypothèse Toto/Bobo ;
4. explication courte ;
5. manipulation ;
6. exercices adaptatifs ;
7. faux signal ou contre-exemple ;
8. résultat de maîtrise ;
9. prochaine révision.

Durée cible : trois à sept minutes, cinq minutes par défaut.

## Validations obligatoires

Lorsque les scripts existent :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

Pour un écran ou une interaction :

- ouvrir réellement l’application ;
- vérifier mobile et web ;
- inspecter la console ;
- tester les CTA ;
- tester loading, empty, error, locked et offline ;
- vérifier reduced motion ;
- vérifier clavier, focus et labels ;
- ne jamais annoncer une validation visuelle non effectuée.

## Définition de terminé

Un lot est terminé lorsque :

- le comportement est utilisable de bout en bout ;
- les données sont versionnées ;
- les tests pertinents passent ;
- le rendu est vérifié ;
- aucun bouton mort n’est ajouté ;
- les visuels possèdent une alternative accessible ;
- la documentation correspond au code ;
- le changement est réversible ;
- le contenu reste éducatif et non prescriptif.

## Rapport de lot

```text
LOT TERMINÉ : [nom]

Objectif utilisateur :
- ...

Problèmes corrigés :
- ...

Fonctionnalités livrées :
- ...

Concepts / visuels / graphiques ajoutés :
- ...

Fichiers modifiés :
- ...

Validations :
- lint :
- typecheck :
- tests :
- contenu :
- build web :
- mobile/web :
- accessibilité :

Commit local :
- hash
- message

Risques ou limites :
- ...

Prochaine action :
- ...
```
