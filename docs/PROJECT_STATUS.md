# État du projet — courant

PatternLab = apprentissage financier gamifié (Expo SDK 57 · React Native 0.86 · React 19.2 ·
TypeScript strict · Expo Router · web statique). Application autonome, local-first, offline ;
posture éducative (aucun ordre, signal, portefeuille réel ni conseil personnalisé). WMB = source
éditoriale, jamais une dépendance runtime ; aucune donnée personnelle.

> **Chiffres = source unique générée.** Les compteurs ci-dessous sont **dérivés du code** par
> `src/data/repoTruth.ts` et garantis par `src/data/repoTruth.test.ts` (unicité, réconciliation
> des formats, résolution des références). Ne **jamais** recopier un nombre à la main dans la doc :
> citer `repoTruth`. Détail complet : `docs/REPO_TRUTH.md`.

## Baseline (dérivée de `repoTruth`)

| Élément | Valeur |
|---|---|
| Concepts riches V5 | 60 |
| Compétences (parcours pilote) | 4 |
| Leçons | 15 |
| Exercices | 30 |
| Termes de glossaire (v1) | 24 |
| Badges | 23 |
| Mondes | 15 |
| Catégories | 13 |
| Types de visuels rendables | 11 |
| Formats d'exercice | 16 déclarés / 13 branchés (en attente : `drag_drop`, `draw_level`, `timed`) |

## Programme en cours — `patternlab-learning-master`

Audit + consolidation (14 lots). Plan complet : `docs/PATTERNLAB_LEARNING_MASTER_PLAN.md`.
Skill : `.claude/skills/patternlab-learning-master/`. Validation **lot par lot**, aucune
publication sans accord.

- **Lot 0 — Vérité du dépôt** ✅ : source unique de compteurs `src/data/repoTruth.ts` (+ test de
  cohérence / contrôle de dérive `repoTruth.test.ts`) ; **fin du repli silencieux** de session —
  un id inconnu affiche « Session introuvable » + CTA Parcours + évènement `session_not_found`,
  au lieu d'enseigner discrètement `skill.actions` ; documentation courante séparée de l'historique
  (`docs/PROJECT_STATUS_ARCHIVE.md`). Voir **ADR-064**.
- **Lot 1 — Navigation & accueil simplifiés** ✅ : barre à 5 onglets **Accueil · Parcours ·
  Apprendre · Réviser · Profil** ; nouveau **hub `Apprendre`** (`(tabs)/apprendre.tsx`) regroupant
  leçons, quiz éclair, quiz visuel, bibliothèque visuelle, glossaire et **Laboratoire** (qui quitte
  la barre, `href:null`) ; **accueil recentré** sur la mission (progression compacte + révision due
  + concept du jour) — grille « Explorer », snapshot redondant et conseils décoratifs retirés ; la
  carte **Quêtes du jour** est déplacée dans **Réussites** (hors du CTA principal). Voir **ADR-065**.
- **Lot 2 — Hiérarchie pédagogique unique** ✅ : fin des **deux parcours concurrents** et du
  déblocage « à la visite ». Modèle pur unique `src/data/learningMap.ts` (`GUIDED_MODULES` : le
  **monde 1** accueille le module « Lire un graphique » = 4 compétences + checkpoint ;
  `buildLearningPath` → **monde N ouvert seulement si le monde N-1 est terminé**, par checkpoint pour
  un monde guidé). Nouvelle route **`/monde/[id]`** (trail guidé pour le monde 1, fiches pour les
  mondes de contenu, états « introuvable » / « verrouillé »). `parcours.tsx` = **un seul** chemin
  vertical des 15 mondes → `/monde/[id]`. **Aucune migration** (dérivé de `completedSkills` +
  `conceptsExplored`). Voir **ADR-066**.
- **Lot 3 — Session pas-à-pas** ✅ : fin de la « leçon non séquencée ». Modèle pur
  `src/data/sessionFlow.ts` (`buildLearnSteps` = **contre-exemple garanti** ; `sanitizeResume` =
  reprise validée, jamais une autre compétence) + `sessionResumeRepository`. La phase Apprendre
  devient un **stepper** (un step par écran, progression + Retour + un seul CTA) ; **reprise exacte**
  après fermeture (+ « Recommencer ») ; le résultat affiche la **maîtrise réelle** (Nouveau→Maîtrisé)
  et la **prochaine révision** au lieu d'un emoji vide. Voir **ADR-067**.
- **Lot 4 — Fondations interactives** ✅ : **Dividende** et **PER** promus en concepts riches
  illustrés par un **nouveau type visuel `mechanism`** (schéma en étapes fléchées, non graphique ;
  `mechanisms.ts` + `MechanismVisual`, câblé dans `VisualCard`/`MiniVisual`, `SUPPORTED_VISUAL_TYPES`
  **10→11**). Concepts **58→60** (supersèdent le glossaire), reliés au **monde 1** (step visuel dans
  la leçon `skill.actions` + **2 exercices** → exercices **28→30**, agrégés au checkpoint). Voir
  **ADR-068**.

Prochains lots (ordre recommandé) : **Lot 5** Graphique canonique (4 modes unifiés) → **Lot 6**
Indicateurs (labs paramétrables) → 7…13. Statut détaillé par lot : voir le plan.

## Programmes terminés (archive)

Journal chronologique complet dans **`docs/PROJECT_STATUS_ARCHIVE.md`** :

- **v1 — croissance produit** (`patternlab-product-growth`), Lots 0 → 19. ADRs 006 → 025.
- **V5 — visuel-first** (`patternlab-v5-master`), Lots 0 → 16. ADRs 026 → 041.
- **« Un signal visuel partout »** — 72 figures dessinées en code, 7 familles. ADRs 042 → 047.
- **Experience Max** (`patternlab-experience-max`), Lots 1 → 10. ADRs 054 → 063.

## Gate (à ré-exécuter à chaque lot)

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run release:check
npm run build:web
```

## Hors périmètre agent (autorisation humaine requise)

- Publication réelle : comptes Apple/Google, build/soumission EAS, achat in-app réel, fournisseur
  analytics/crash externe, source native NetInfo — voir `docs/RELEASE_READINESS.md`.
- Aucune poussée, fusion, déploiement ni activation d'achat réel sans accord explicite.

## Branche

Travail sur `claude/connexion-application-1n30su` ; distant `origin`
(`Mendestrading21/patternlab`). Conteneur éphémère : committer tôt.
