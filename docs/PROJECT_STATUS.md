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
| Concepts riches V5 | 58 |
| Compétences (parcours pilote) | 4 |
| Leçons | 15 |
| Exercices | 28 |
| Termes de glossaire (v1) | 24 |
| Badges | 23 |
| Mondes | 15 |
| Catégories | 13 |
| Types de visuels rendables | 10 |
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

Prochains lots (ordre recommandé) : **Lot 2** Hiérarchie unique (Monde → Module → Compétence +
migration) → **Lot 3** Session pas-à-pas → 4…13. Statut détaillé par lot : voir le plan.

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
