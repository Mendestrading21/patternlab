---
name: patternlab-experience-max
description: Skill maître pour transformer PatternLab en bibliothèque de trading parfaite, immersive et 100 % attractive — graphiques interactifs impeccables un par un, visuels partout (chaque question/carte/concept), quiz basés sur l'image, leçons vivantes, 15 mondes, Toto & Bobo enrichis, gamification et rétention — exécuté par gros lots visibles, testés, accessibles et publiés en live.
---

# PatternLab — Experience Max

## Mission

Faire de PatternLab **la** bibliothèque de trading pour débutants : un lieu où l'on apprend,
où l'on s'intéresse et où l'on progresse, avec assez de contenu pour y passer **des dizaines
d'heures** (objectif ≈ 70 h). Chaque question, chaque carte, chaque concept porte **toujours un
signal visuel** de ce qu'il représente : bougies, figures, graphiques interactifs, illustrations
codées. But : une expérience 100 % attractive, vivante, sans bouton mort.

Ne jamais créer d'application parallèle. Améliorer le dépôt existant **par gros lots**, chacun
visible, testé, documenté, réversible — et **publié en live** après validation.

## Positionnement absolu

> Application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un
> risque de perte.

PatternLab n'est jamais : un courtier ; un service de signaux ; du copy trading ; un exécuteur
d'ordres ; un portefeuille réel ; un casino ; une promesse de gains.

- Vocabulaire recommandé : setup haussier, setup baissier, entrée théorique, zone de confirmation,
  invalidation, objectif pédagogique, faux signal, scénario éducatif.
- Vocabulaire interdit dans l'interface pédagogique : `BUY`, `SELL`, signal sûr, profit garanti,
  trade gagnant, liberté financière garantie, « high probability » présenté comme certitude.

Conformité garantie par test : `vocabularyIssuesIn` (source unique dans `src/data/learningConcept.ts`)
+ la porte éditoriale de `scripts/validate-content/index.mjs`. Aucune donnée personnelle (WMB/APP).

## Identité

- **Toto** = taureau vert : formule des hypothèses haussières conditionnelles.
- **Bobo** = ours rouge : traque le risque, l'invalidation et le faux signal.

Les deux mascottes accompagnent l'utilisateur partout (leçon, exercice, résultat, révision) avec
des animations douces qui **respectent la réduction d'animation**.

## Règles de travail

1. **Un seul gros lot par session.** Chaque lot est visible, testé, documenté et réversible.
2. **Gate verte obligatoire** avant tout commit (voir « Validations obligatoires »).
3. **Un signal visuel partout** : toute question / carte / concept expose un visuel (VisualCard,
   MiniVisual, PatternChart, InteractiveChart…) avec un `accessibilitySummary`.
4. **Réutiliser l'existant** : moteur de visuels (`src/engines/visual`), graphiques
   (`src/engines/pattern`), types d'exercices graphiques, `V5_CONCEPTS`, design system.
5. Accessibilité (contraste AA, cibles 44 px, labels, focus/clavier web) ; **mobile-first** ;
   iOS + Android + web ; TypeScript strict ; **zéro bouton mort**.
6. Contenu V5 en `needsReview` — **jamais auto-publié** sans revue ; import idempotent.
7. **Publier en live après chaque lot** : fusion `dev → main` sans conflit → le workflow
   `deploy.yml` publie sur GitHub Pages → vérifier le run vert. (Le live se sert **uniquement**
   depuis `main`.)
8. Ne jamais pousser vers une autre branche sans accord ; ne jamais réécrire l'historique ;
   ne jamais inclure secrets/tokens/données clients.

## Architecture cible

```text
LearningPath
  World
    Module
      Skill
        Concept
          Lesson
            Step / Visual / Interaction / Exercise / Feedback / Flashcard / Review / Assessment
```

Séparer strictement : XP = activité ; mastery = compétence ; confidence = stabilité ;
reviewDueAt = prochaine révision ; streak = régularité ; coins = récompense ; errorTags = erreurs.

## Boucle quotidienne cible

Mission du jour → observation d'un graphique → hypothèse Toto/Bobo → explication courte →
manipulation → exercices adaptatifs → faux signal / contre-exemple → résultat de maîtrise →
prochaine révision. Durée : trois à sept minutes, **cinq par défaut**.

## Roadmap (A → Z — un gros lot par session)

1. **Parcours visuel-first dès la première minute** — phase « Apprendre » avant les exercices ;
   bougies + graphique dès `skill.actions` ; bougie dans l'onboarding ; lien parcours → fiche
   concept. *(Lot 1 — livré.)*
2. **Graphiques parfaits, un par un** — audit + polish de chaque renderer (légendes, axes, échelle,
   couleurs sémantiques, lisibilité mobile, états haussier/baissier/neutre, a11y) ; rendre les types
   encore absents (`volume-profile`, `comparison`, `cheat-sheet`).
3. **Quiz visuels enrichis** — plus de questions basées sur l'image, banques par difficulté,
   feedback avec visuel, tous les formats graphiques exploités.
4. **Contenu massif (bibliothèque)** — `V5_CONCEPTS` 38 → 150 → 500+, chaque monde étoffé,
   glossaire premium relié aux fiches.
5. **Leçons immersives** — chaque skill = leçon guidée (observe → hypothèse → visuel → graphique
   interactif → exercice), storyline Toto/Bobo.
6. **Parcours & 15 mondes vivants** — carte verticale façon Duolingo, déblocages, jalons,
   checkpoints visuels.
7. **Toto & Bobo vivants** — plus d'états/animations douces (reduced-motion), dialogues contextuels.
8. **Gamification & rétention** — XP/mastery/streak/coins, badges, missions variées, révision
   espacée, « concept du jour ».
9. **Accueil & navigation attractifs** — home vivante, cohérence design system, zéro bouton mort.
10. **Accessibilité, perf & finition release** — a11y complète, offline, perf, docs, release.

## Validations obligatoires

Avant chaque commit, gate complète (dans l'ordre) :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run release:check
npm run build:web
```

Puis vérification navigateur (Chromium, 390×844) de l'écran/flux touché : ouvrir réellement l'app,
piloter le parcours, inspecter la console (0 erreur), tester CTA + états (loading/empty/error/locked),
vérifier reduced motion, focus/clavier et labels. Ne jamais annoncer une vérification non effectuée.

## Définition de terminé

Un lot est terminé lorsque : le flux est utilisable de bout en bout ; les données sont versionnées ;
les tests pertinents passent ; le rendu est vérifié dans le navigateur ; aucun bouton mort ; chaque
visuel a une alternative accessible ; la doc correspond au code ; le changement est réversible ; le
contenu reste éducatif et non prescriptif ; **le live reflète le lot** (déployé depuis `main`).

## Rapport de lot

```text
LOT TERMINÉ : [nom]

Objectif utilisateur :
Problèmes corrigés :
Fonctionnalités livrées :
Concepts / visuels / graphiques ajoutés :
Fichiers modifiés :
Validations :
- lint :
- typecheck :
- tests :
- contenu :
- release :
- build web :
- navigateur / accessibilité :
Commit local :
- hash
- message
Publication live :
- fusion main + run deploy
Risques ou limites :
Prochaine action :
```
