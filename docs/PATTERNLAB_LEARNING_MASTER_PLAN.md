# PatternLab Learning Master — Audit & Plan des 14 lots

Skill : `patternlab-learning-master`. Programme d'**audit + consolidation** (pas une refonte
technique). Établi le 2026-07-21 sur la branche `claude/connexion-application-1n30su` (dépôt à jour
avec `main`, dernier merge `902e4dd`). **Aucun code touché** tant que chaque lot n'est pas validé.

## Baseline — vérifiée par le code (pas recopiée d'un doc)

| Élément | Valeur (code) |
|---|---|
| Onglets visibles | 5 : Accueil · Parcours · **Labo** · **Révisions** · Profil (+ leçons/quiz masqués) |
| Concepts riches V5 | **58** (`learningContent.ts` 38 + `learningContentBatch.ts` 20) |
| Compétences runtime | **4** (actions, trend, candles, patterns) |
| Leçons / exercices (`seed.ts`) | **15** / **28** |
| Formats d'exercice | **16 déclarés** / **13 graders** enregistrés (incohérence) |
| Glossaire v1 | **24** termes |
| Badges | 23 |
| Gate | verte — compteurs désormais générés par `src/data/repoTruth.ts` (Lot 0) |

## Verdict de l'audit
Le socle est solide (stack moderne, moteurs purs testés, conformité éducative, visuels SVG
déterministes, a11y). Ce qu'il faut : **une seule trajectoire**, des **leçons réellement séquencées**,
des **mondes fondés sur la maîtrise** (pas la simple visite), une **bibliothèque transformée en
pratique**, et une **interface plus calme**. Plusieurs lots **retravaillent** ce que le programme
Experience Max a ajouté (c'est voulu : consolider, pas empiler).

## Problèmes structurants (P0 → P2) et où ils sont dans le code
- **P0 — Deux parcours concurrents** : `(tabs)/parcours.tsx` montre le trail 4-compétences **et** la
  carte des 15 mondes → deux modèles de progression sur une page.
- **P0 — 15 mondes = catalogue, pas parcours** : `worldPath.ts` débloque à la 1re visite, « terminé »
  = toutes les fiches vues → mesure la navigation, pas l'apprentissage.
- **P0 — Accueil dense** : mission + snapshot + concept du jour + révisions + quêtes + 6 tuiles
  Explorer + 2 mascottes + disclaimer.
- **P0 — Leçon non séquencée** : la phase `learn` de `session/[skillId].tsx` rend tous les steps sur
  un seul écran défilant.
- **P1** : écart contenu/parcours (58 concepts, 4 skills) · Dividende/PER passifs (glossaire seul) ·
  moteur d'exercices incohérent (16/13, `drag_drop`/`draw_level`/`timed` sans grader) · **fallback
  silencieux** session inconnue → `skill.actions` · progression gonflable (voir = exploré) · premium
  non vendable.
- **P2** : animations mascottes limitées + dialogues à 3–4 variantes génériques · doc `PROJECT_STATUS`
  qui garde de vieilles sections contradictoires.

---

## Plan des 14 lots (ordre du skill) — statut vs app actuelle

| # | Lot | Statut | Ce que ça change | Risque |
|---|---|---|---|---|
| 0 | **Vérité du dépôt** | 🟢 fait | Source unique `src/data/repoTruth.ts` (+ test de dérive) ; réconciliation des formats (16/13) ; fin du repli silencieux de session ; doc courante séparée de l'historique (`PROJECT_STATUS_ARCHIVE.md`). Voir **ADR-064**. | faible |
| 1 | **Navigation & accueil simplifiés** | 🔴 à faire | 5 onglets **Accueil · Parcours · Apprendre · Réviser · Profil** ; **Labo → hub Apprendre** (biblio, glossaire, quiz visuel, leçons, labs) ; accueil réduit à mission + progression compacte + révision/concept du jour. | moyen (refonte tab bar + routes) |
| 2 | **Hiérarchie pédagogique unique** | 🔴 à faire | Ajouter **Module + Compétence** au modèle des 15 mondes ; migrer les 4 skills pilotes dans le **monde 1** ; route **détail Monde** ; déblocage par **checkpoints** ; migration de progression non destructive. | élevé (modèle + migration) |
| 3 | **Session pas-à-pas** | 🔴 à faire | **Un step par écran** (stepper, retour, CTA unique, progression) ; **reprise de session** après fermeture ; résultat de **maîtrise réelle** ; **contre-exemple obligatoire** ; fin du fallback silencieux. | moyen |
| 4 | **Fondations interactives** | 🔴 à faire | **Dividende & PER** en `LearningConcept` riches + visuels de mécanisme ; leçons/exercices du **monde 1** ; checkpoint complet. | faible-moyen |
| 5 | **Graphique canonique** | 🟡 partiel | Axes/labels/légendes lisibles + volume + overlays + replay ; **4 modes static/guided/interactive/blind** unifiés ; datasets purs ; snapshots + tests vide/plat/extrême. (Déjà : grille, volume, replay, mode aveugle.) | moyen |
| 6 | **Indicateurs** | 🟡 partiel | **Labs paramétrables** RSI/MACD/Bollinger/MM/volume/VWAP + quiz visuels + faux signaux. (Déjà : fiches + `IndicatorPanel`.) | moyen |
| 7 | **Exercices adaptatifs** | 🔴 à faire | **`EXERCISE_FORMAT_REGISTRY`** unique (type/grader/renderer/a11y/statut) ; finaliser ou retirer `drag_drop`/`draw_level`/`timed` ; **misconceptions typées** ; réinsertion adaptative + deck d'erreurs. | moyen |
| 8 | **Glossaire & bibliothèque premium** | 🟡 partiel | Recherche unifiée ; mini-visuels + **statut de maîtrise** ; favoris/collections ; navigation concept↔pratique ; **comparaison visuelle**. (Déjà : recherche glossaire, favoris, récents.) | faible-moyen |
| 9 | **Toto/Bobo V3** | 🟡 partiel | **`MascotMoment`** (entrée/geste/pointage/sortie) ; **dialogues liés aux erreurs conceptuelles** ; inventaire d'assets + reduced motion. (Déjà : moteur de dialogue contextuel + réactions.) | faible-moyen |
| 10 | **Contenu des 15 mondes** | 🟡 partiel | Atteindre **75 puis 150 concepts jouables**, chacun relié à leçon + pratique + révision ; checkpoints + prérequis ; revue humaine + provenance. (Déjà : 58 fiches, mais peu reliées à un chemin.) | moyen (volume éditorial) |
| 11 | **Progression, révision & rétention** | 🔴 à faire | États **Découvert/Pratiqué/Compris/Solide/Maîtrisé** ; révision au niveau concept ; célébrations de badges (toast/modale) ; stats 30 jours ; quêtes hors du CTA principal. | moyen |
| 12 | **Abonnement réel prêt à brancher** | 🟡 partiel | Une offre **Plus** ; abstraction **entitlement** ; états achat/restauration/offline/expiration. **Aucun achat réel sans tes comptes + autorisation.** | faible (sans achat réel) |
| 13 | **Release native** | 🔴 à faire — **action humaine** | VoiceOver/TalkBack ; NetInfo natif ; **build EAS signé** ; TestFlight/Play interne ; provider crash/analytics ; captures + fiches stores. **Nécessite tes comptes Apple/Google.** | externe |

Légende : 🔴 à faire · 🟡 partiel (socle existant à consolider) · 🟢 fait.

---

## Séquence recommandée
1. ~~**Lot 0 — Vérité du dépôt**~~ ✅ **fait** : source unique `repoTruth`, fin du repli silencieux,
   doc courante/historique séparées (ADR-064).
2. **Lot 1 — Navigation & accueil** *(prochain)* : premier flux visible, prépare tout le reste (hub
   Apprendre).
3. **Lot 2 — Hiérarchie unique** : le changement structurant central (monde → module → compétence +
   migration). Après lui, les leçons/mondes/stats ont une seule source de vérité.
4. Puis Lots 3 → 11 dans l'ordre ; Lot 12 (entitlement prêt, sans achat) ; Lot 13 seulement avec tes
   comptes.

## Méthode par lot (rappel skill)
Logique pure + tests d'abord → migration non destructive si le modèle change → données, moteurs,
écrans → gate complète (`lint · typecheck · test · validate:content · release:check · build:web`) →
pilotage réel 320/390/430 px + console + clavier → doc à jour → **publication live sur ton accord**.
Rapport factuel (testé vs parcouru vs déclaré), jamais un test/appareil non exécuté.
