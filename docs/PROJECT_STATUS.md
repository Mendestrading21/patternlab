# État du projet

## PatternLab V5 — en cours (skill `patternlab-v5-master`)
2026-07-19 — Démarrage du programme **V5** (16 lots, visuel-first, 500+ concepts) par-dessus la v1.
Plan maître : `docs/PATTERNLAB_V5_MASTER_PLAN.md`. Skill installé sous `.claude/skills/patternlab-v5-master/`.
- **V5 Lot 0 — Fiabilité & vérité du dépôt** ✅ : baseline vérifiée verte ; plan maître écrit. La v1 (Lots 0→19) couvre déjà la fiabilité — aucun correctif requis.
- **V5 Lot 1 — Schéma de contenu V5** ✅ : modèle riche `LearningConcept` (`src/data/learningConcept.ts`) + registres `WORLDS` (15) / `CATEGORIES` (13) + helpers purs + garde de vocabulaire (aucun BUY/SELL/promesse) + `checkConceptsIntegrity`. Pont non destructif `glossaryFromConcepts` (la v1 reste la source de l'écran glossaire jusqu'au Lot 4). Schéma `learning-concept.schema.json` + `validate:content` étendu aux brouillons `concepts-v5/` (needsReview). Amorce de 3 concepts (marteau, double creux, support/résistance). Validations : lint · typecheck · tests **251** (+11) · validate:content **23** · release:check 13 · build:web. Voir **ADR-026**.
- **V5 Lot 3 — Moteur de visuels statiques** ✅ : géométrie pure `candleGeometry` (réutilise `priceScale`), datasets OHLC déterministes (`visualDatasets`), composants SVG responsifs (`CandlestickGlyphs`, `CandleAnatomy`) + `VisualCard` (dispatch par `VisualSpec.type` : candle-anatomy / candlestick-pattern / chart-pattern / market-structure ; **résumé accessible** visible et en label). Écran **fiche concept** `/concept/[slug]` (visuel + reconnaissance + scénarios + faux signaux + flashcard + liés) ; section **« Visuels V5 »** au Laboratoire. Validations : lint · typecheck · tests **261** (+10) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : anatomie/marteau/support-résistance rendus en SVG, résumé accessible présent, responsive 320px, console propre. Voir **ADR-027**.
- **V5 Lot 4 — Glossaire premium** ✅ : source unifiée `UNIFIED_GLOSSARY` (termes v1 + concepts V5 dérivés, dédupliqués par slug, version riche prioritaire) via `glossaryUnified.ts` + `hasConceptFiche`. Logique pure `favorites.ts` (`toggleInSet`, `pushRecent` borné à 12). Persistance `glossaryPrefsRepository` (`patternlab.glossaryprefs.v1`) câblée dans `ProgressProvider` : `favorites` (Set), `toggleFavorite`, `markRecentlyViewed`, réinitialisés par `reset()`. Écran glossaire : vues **Tout / ★ Favoris / Récents**, étoile ★/☆ par carte, tag **« fiche visuelle »**, liaison `/concept/[slug]` (fiche riche) ou `/glossaire/[slug]`. Favori + `markRecentlyViewed` ajoutés aux fiches `/glossaire/[slug]` et `/concept/[slug]`. Validations : lint · typecheck · tests **275** (+14) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : bascule favori persistée (`{"favorites":["marteau"]}`), vues filtrantes, terme « fiche visuelle » → `/concept/marteau`, Récents alimenté à la consultation, responsive 320/375/430px, console propre. Voir **ADR-028**.
- **V5 Lot 2 — Design System V5** ✅ : extension non destructive « Instrument Glass ». Palette : `backgroundDeep` aligné **#070B11**, sémantique **`advanced` #9B7CF6** (+ `onAdvanced`) pour les concepts experts, jetons **verre** `glass`/`glassBorder`. Tonalité pure `difficultyTone` (Découverte/Intermédiaire/Avancé, testée). Composants réutilisables câblés : `FavoriteButton` (remplace l'étoile réécrite ×3), `SegmentedControl` + `Badge` (remplace la barre de vues manuscrite, avec compteurs favoris/récents), `GlassCard` (héros « En bref » de la fiche concept). Puce de difficulté colorée par tonalité. Garde AA étendue (`advanced`/`onAdvanced` verrouillés). Validations : lint · typecheck · tests **284** (+9) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : segments + badges, favori persisté, `GlassCard` héros, puces `Intermédiaire · 3/5` / `Découverte · 2/5`, responsive 320/430px, console propre. Voir **ADR-029**.
- **V5 Lot 5 — Chart Engine MVP + ADR** ✅ : benchmark de rendu documenté (**ADR-030** ; le n° 006 du skill étant pris, suite séquentielle V5) → décision de **rester sur `react-native-svg`** avec architecture logique pure / rendu mince, Skia gardé en secours documenté. Nouveau module pur `chartEngine.ts` : **volume** déterministe (`candleVolume`/`volumeSeries`/`maxVolume`, dérivé de la géométrie, jamais une donnée réelle) + **replay** bougie par bougie (machine à états `initReplay`/`stepReplay`/`revealAll`/`resetReplay`, bornée). Rendu `MarketReplayChart` (chandeliers clippés + panneau volume, **échelle sur série complète** donc axe stable, résumé accessible, statique/reduced-motion safe). Nouveau scénario Laboratoire « Observe la participation (replay) » (⏮/◀/▶/⏭, analytics `volume_replay`) ; bouton mort « Tracé de zones & replay » remplacé (zone/tendance/annotations annoncées comme futures, non silencieuses). Validations : lint · typecheck · tests **293** (+9) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : replay 6→7→24/24 « Séquence complète », retour ⏮ à 1/24, volume rendu, label accessible, scénario support intact, responsive 320/430px, console propre. Voir **ADR-030**.
- **V5 Lot 6 — Exercices graphiques** ✅ : 3 nouveaux formats branchés sur le moteur extensible (union discriminée + registre de graders purs + `ExercisePlayer`), **12 formats** au total. **`place_invalidation`** (placer un niveau ; grader pur à tolérance absolue ; cible déterministe calculée depuis la série via `supportLevel`/`resistanceLevel` ; renderer `InteractiveChart` + flèches a11y). **`label_chart`** (étiqueter une bougie marquée par un repère ▲ ; grader index ; repère SVG `reward`, jamais porté par la seule couleur). **`sequence_market_structure`** (ordonner les phases de structure ; grader `numberArrayEquals` ; logique de réordonnancement factorisée en `ReorderList`, réutilisée par `order`). Exercices de démo dans skill.patterns ; libellés session/quiz mis à jour. Validations : lint · typecheck · tests **297** (+4) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium (session skill.patterns) : les 3 formats se rendent et se corrigent (niveau placé → feedback, repère ▲ + options, séquence réordonnable), responsive 320/430px, console propre. Voir **ADR-031**.
- **V5 Lot 7 — Leçons V5 (visual-first)** ✅ : modèle de leçon étendu (non destructif) avec 2 nouveaux steps **`visual`** (schéma SVG d'un concept via `VisualCard`) et **`hypothesis`** (Toto haussier / Bobo risque, depuis les scénarios du concept) + champ **`conceptRef`** (slug primitif → aucune dépendance circulaire `engines/learning`↔`data`, résolu à l'écran). Écran leçon : step visuel + « Comment reconnaître » + bouton **« Voir la fiche complète »** vers `/concept/[slug]`, hypothèse Toto/Bobo, note de prochaine révision. 3 leçons visual-first amorce (`lesson.hammer-v5`, `lesson.support-resistance-v5`, `lesson.double-bottom-v5`, `status: 'draft'`) reliant leçon → concept → fiche → session. Validations : lint · typecheck · tests **302** (+5) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : VisualCard rendu, hypothèse Toto/Bobo, « Voir la fiche » → /concept/marteau, « Terminer » → /session/skill.candles, onglet Leçons liste les nouvelles leçons, responsive 320/430px, console propre. Voir **ADR-032**.
- **V5 Lot 8 — Parcours & carte des 15 mondes** ✅ : vue catalogue pure `worldOverview.ts` (`buildWorldOverview`/`worldsWithContent`) réconciliant le registre statique `WORLDS` (15) avec le contenu réel (`conceptsByWorld`), **non destructif** (trail runtime `worldMap.ts` inchangé). Écran Parcours : sous le trail pilote (priorité conservée), section **« 🗺️ La carte des mondes »** listant les 15 mondes (ordre, titre, sous-titre, compteur « N/15 ouverts »). Mondes avec contenu → cliquables vers `/concept/[slug]` + analytics `world_opened` ; mondes vides → pastille « à venir » désactivée (aucun bouton mort). Nouvel évènement `world_opened` (union + `EVENT_CATEGORIES` synchronisés). Validations : lint · typecheck · tests **306** (+4) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : trail pilote intact, 15 mondes listés, chips concept/à venir, « Figures chartistes » → /concept/double-creux, responsive 320/430px, console propre. Voir **ADR-033**.
- **V5 Lot 9 — Contenu pilote riche (premier lot éditorial)** ✅ : `V5_CONCEPTS` passe de **3 à 12 concepts** pleinement rédigés (9 nouveaux : anatomie de bougie, doji, étoile filante, avalement haussier, double sommet, tendance haussière, cassure de structure/BOS, range, polarité/flip) — définition, reconnaissance, scénarios, invalidation, faux signaux, `visualSpec`, flashcards, mini-quiz, relations ; tous `needsReview`. 3 nouveaux datasets OHLC déterministes (`pattern.double-top.v1`, `structure.uptrend.v1`, `structure.bos.v1`). **Portail fabrique** `contentFactory.test.ts` (garde-fou montant en charge : unicité, intégrité + vocabulaire propres sur tout le corpus, visuels rendables, ≥ 5 mondes couverts). Surfaçage automatique non destructif : glossaire (35 termes), carte des mondes (**5/15 ouverts** : + anatomie, structure), fiches `/concept/[slug]`. Validations : lint · typecheck · tests **312** (+6) · validate:content 23 · release:check 13 · build:web. Vérifié en pilotant Chromium : 5 fiches nouvelles rendues (SVG + a11y), glossaire liste les nouveaux termes, parcours « 5/15 mondes ouverts », responsive 320/430px, console propre. Voir **ADR-034**.
- **V5 Lot 10 — Montée en charge éditoriale (voie JSON vers 500+)** ✅ : infrastructure de scaling plutôt que volume brut. 8 nouveaux **brouillons JSON `needsReview`** (`content/drafts/concepts-v5/` : volume, profil de volume, RSI, moyenne mobile, stop, taille de position, FOMO, accumulation Wyckoff) → corpus éditorial **10 concepts / 7 mondes**, chacun avec `sourcePath`/`sourceHash` (idempotence). **Portail éditorial** dans `validate:content` : idempotence (id/slug uniques), vocabulaire (aucun BUY/SELL/promesse), statut needsReview, + rapport de couverture par monde et vers 150/500 — les conflits font échouer la CI. Module pur testé `src/content/coverage.ts` (couverture par catégorie vs `target`, jalons, idempotence). Surface in-app : carte **« Progression du contenu »** sur Parcours (12/150). Doc `CONTENT_COVERAGE.md`. Validations : lint · typecheck · tests **317** (+5) · validate:content **31** · release:check 13 · build:web. Vérifié en pilotant Chromium : carte « Progression du contenu » (12/150 + barre), carte des mondes intacte (5/15), responsive 320/430px, console propre. Voir **ADR-035**.
- **V5 Lot 11 — Gamification & stats (réussites « compréhension »)** ✅ : extension responsable de la gamification v1. Compteurs cumulatifs `ProgressState.learning` (schéma **v6** : concepts/mondes explorés, faux signaux repérés), champ optionnel + migration sûre (`migrateLearning`). Logique pure testée `learningStats.ts` (`addConceptExplored` idempotent, `addFalseSignalSpotted`, `isFalseSignalExercise`). **6 badges V5 « compréhension »** (Anatomiste des bougies / Cartographe des tendances / Lecteur de figures via maîtrise ≥ 50 %, Détecteur de faux signaux, Curieux, Cartographe des mondes) — tous atteignables, récompensent le savoir/la diversité, jamais des gains/la vitesse. Câblage : `markConceptExplored` (fiches concept + glossaire, **gated sur `ready`** → suivi fiable au deep-link), `recordFalseSignal` en session. Stats : carte **« Exploration »** ; Réussites groupées Progression/Compréhension. Validations : lint · typecheck · tests **328** (+11) · validate:content 31 · release:check 13 · build:web. Vérifié en pilotant Chromium (bout en bout) : explorer 5 concepts/3 mondes → stats « 5 concepts, 3 mondes », badges « Curieux » + « Cartographe des mondes » débloqués, responsive 320/430px, console propre. Voir **ADR-036**.
- **V5 Lot 12 — Offline & perf** ✅ : réutilise la base local-first v1 et l'étend à la couche V5. `OfflineCapabilities` gagne `concepts`/`visualDatasets`/`worlds`/`unifiedGlossary` (calculés depuis `V5_CONCEPTS`/`VISUAL_DATASETS`/`WORLDS`/`UNIFIED_GLOSSARY`) ; `contentReady` exige aussi concepts + visuels ; les visuels sont **générés en code** (jamais téléchargés). Carte « Mode hors-ligne » du Profil enrichie. Perf : `useMemo` sur les dérivés statiques (Parcours : `buildWorldOverview`/`worldsWithContent`/`coverageTotals`, hoistés avant tout retour ; Laboratoire : `generateCandles`) — même sortie, moins de recalcul. Validations : lint · typecheck · tests **330** (+2) · validate:content 31 · release:check 13 · build:web. Vérifié en pilotant Chromium **hors-ligne** (Playwright `setOffline`) : résumé V5 honnête, indicateur bascule réactivement « Hors ligne », navigation client vers une fiche concept rend son visuel SVG **sans réseau**, console propre. Voir **ADR-037**.
- **V5 Lot 13 — Monétisation (démo, aucun achat réel)** ✅ : réutilise la démo v1 et livre un perk Premium **réel et verrouillé** sans bloquer l'apprentissage. Logique pure testée `revisionDeck.ts` (`buildRevisionDeck` réunit flashcards + mini-quiz des concepts). Écran `/revision-deck` : gratuit → **gate** (aperçu + « Débloquer avec Premium » + note démo + `premium_gate_hit` gated sur `ready`) ; premium → le deck (Flashcard). Entrée depuis l'onglet Révisions (badge Premium, aucun bouton mort). Perk **juste** : flashcards/quiz restent gratuits sur chaque fiche ; seul le deck consolidé est Premium. `PREMIUM_FEATURES`/`FREE_FEATURES` réécrits pour être honnêtes (2 perks réellement livrés en tête : stats complètes + deck ; cœur d'apprentissage gratuit). Validations : lint · typecheck · tests **333** (+3) · validate:content 31 · release:check 13 · build:web. Vérifié en pilotant Chromium bout en bout : gratuit → gate ; activation démo → deck débloqué (26 cartes), responsive 320/430px, console propre. Voir **ADR-038**.
- **V5 Lot 14 — Analytics (journal de transparence + singleton robuste)** ✅ : exploite le socle analytics responsable v1. Module pur testé `insights.ts` (`computeInsights` : total, comptes par évènement/catégorie, entonnoir d'apprentissage — uniquement des comptes, aucune PII). Écran **« Journal d'usage »** `/journal` (transparence : voir/vider les évènements locaux, entonnoir, bannière « Suivi désactivé » si opt-out) accessible depuis Profil › Confidentialité. **Correctif de fond** (bug révélé en pilotant le journal) : le singleton analytics se dupliquait aux frontières de bundle (rendu web Expo) → évènements éparpillés sur plusieurs tampons ; corrigé par imports unifiés `@/analytics`, **singleton ancré sur `globalThis`**, et helpers `recentEvents()`/`clearRecentEvents()` lisant `globalThis` à l'appel. Validations : lint · typecheck · tests **336** (+3) · validate:content 31 · release:check 13 · build:web. Vérif : `computeInsights` testé ; mécanisme de capture prouvé (le tampon ancré sur `globalThis` contient bien les évènements, lu par le même chemin que le journal) — capture d'écran E2E gênée par le cache du serveur dev (artefact d'outillage). Voir **ADR-039**.
- **V5 Lot 15 — Accessibilité complète** ✅ : complète et vérifie l'a11y de toutes les surfaces V5, en réutilisant la base v1 (contraste AA testé, cibles 44, type dynamique, en-têtes, réduction d'animation, `decorative`). Nouveau `describeCandles` (pur, testé) → résumé accessible « structure haussière/baissière/latérale + extrêmes » appliqué à `PatternChart` (`accessible` + role image + label descriptif) et au label de `InteractiveChart` (les graphiques, cœur de l'app, sont enfin décrits sans dépendre de la couleur). Audit confirmé : réduction d'animation honorée par tous les composants animés (surfaces V5 statiques), mascottes décoratives/labellisées, rôles+états sur les interactifs V5. Doc `ACCESSIBILITY.md` (posture complète). Validations : lint · typecheck · tests **341** (+5) · validate:content 31 · release:check 13 · build:web. Vérifié en pilotant Chromium (DOM) : aria-labels des graphiques (InteractiveChart inclut le résumé de structure, MarketReplayChart, VisualCard, PatternChart via `describeCandles`), en-têtes présents, console propre. Voir **ADR-040**.
- **V5 Lot 16 — Release readiness** ✅ (**dernier lot**) : `runReleaseChecks` gagne un invariant **« contenu V5 en revue (aucun brouillon auto-publié) »** (échec si un brouillon `concepts-v5/` est `approved`/`published`) ; le runner calcule l'entrée depuis les JSON → `release:check` passe à **14 vérifications**. Checklist finale `RELEASE_READINESS.md` (portes automatisées vertes + invariants garantis par test + étapes manuelles de soumission store). Validations : lint · typecheck · tests **342** (+1) · validate:content 31 · release:check **14** · build:web. Voir **ADR-041**.

## 🏁 Feuille de route V5 — COMPLÈTE (Lots 0 → 16)
Programme `patternlab-v5-master` terminé : schéma de contenu riche (Lot 1), design system étendu (2),
moteur de visuels SVG (3), glossaire premium (4), chart engine MVP + ADR (5), exercices graphiques (6),
leçons visual-first (7), carte des 15 mondes (8), contenu pilote riche 3→12 concepts + fabrique (9),
montée en charge éditoriale vers 500+ (10), gamification & stats « compréhension » (11), offline & perf (12),
monétisation démo (13), analytics + journal de transparence (14), accessibilité complète (15), release
readiness (16). Gate final vert. **Aucun push ni publication sans accord explicite.** ADRs 026 → 041.

## Initiative « un signal visuel partout » (post-V5 — inspirée des 66 images de référence)
Déclencheur : l'utilisateur a ajouté `Patern Images REF/` (66 figures de trading) comme **inspiration**
— l'app doit **coder ses propres schémas** pour que chaque figure/carte/concept porte un signal visuel.
Les images restent hors périmètre de commit (déjà sur `main`, jamais une dépendance runtime).
- **Lot 1 — Bibliothèque visuelle de chandeliers** ✅ : ~20 nouveaux datasets OHLC déterministes
  (`visualDatasets.ts` : pendu, marteau inversé, dojis libellule/pierre-tombale, toupie, marubozu ×2,
  avalement baissier, harami ×2, ligne de perce, couverture en nuage, pincettes ×2, étoiles matin/soir,
  trois soldats/corbeaux, tendance baissière) ; catalogue pur `patternLibrary.ts` (**29 glyphes**,
  4 familles, `glyphToVisualSpec` + gardes d'intégrité et de vocabulaire testées) ; garde de vocabulaire
  factorisée en source unique (`vocabularyIssuesIn`) ; écran galerie **`/bibliotheque-visuelle`**
  (29 figures groupées par famille, **filtre par direction**, résumés accessibles) relié au Laboratoire.
  Schémas 100 % générés en code — aucune image de référence copiée/embarquée. Validations : lint ·
  typecheck · tests **350** (+8) · validate:content 31 · release:check 14 · build:web. Vérifié en pilotant
  Chromium (390×844) : 29 SVG rendus, 4 familles, filtre 29→baissières, 0 erreur console. Voir **ADR-042**.
- **Lot 2 — Figures chartistes + moteur d'overlays** ✅ : `CandlestickGlyphs` gagne des props
  **`guides`** (tracés libres entre ancrages `{i, price}` : ligne de cou, tendance, canal ; pointillé +
  label) et **`markers`** (repères « épaule »/« tête »…). Registre pur `figureOverlays.ts` (indexé par
  variant) lu par `VisualCard` pour les specs `chart-pattern`. **20 nouvelles figures** (datasets + glyphes,
  famille `figure-chartiste`) : triple creux/sommet, épaule-tête-épaule ±inversé, triangles asc/desc/sym,
  biseaux, drapeaux, fanions, rectangles, canaux, tasse-anse, arrondis ; doubles creux/sommet gagnent leur
  ligne de cou. Galerie **49 figures**. Validations : lint · typecheck · tests **353** (+3) · validate:content
  31 · release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : 49 SVG, 13 lignes de cou en
  pointillé + trendlines rendues, 6 figures repères présentes, 0 erreur console. Voir **ADR-043**.
- **Lot 3 — Structure & Smart Money Concepts** ✅ : **8 concepts SMC** (famille `structure-smc`), rendus
  en `chart-pattern` via le moteur d'overlays du Lot 2 (aucun nouveau code de rendu) : changement de
  caractère (CHoCH), zones d'offre/demande (bandes colorées), order block, fair value gap (dataset 3 bougies
  avec vrai déséquilibre), balayage de liquidité (hauts égaux + sweep), faux signal, cassure-retest. Nouveau
  helper `band()` pour les zones. Cadrage éducatif, vocabulaire conforme. Galerie **57 figures** / 6 familles.
  Validations : lint · typecheck · tests **353** · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium (390×844) : 57 SVG, 8 bandes de zones, repères CHoCH/FVG/sweep/retest/order
  block/offre/demande rendus dans les SVG, 0 erreur console. Voir **ADR-044**.
- **Lot 4 — Indicateurs techniques** ✅ : nouveau type de rendu `indicator` (premier non-bougie). Calculs
  purs testés `indicatorMath.ts` (sma, ema, rsi Wilder, macd, bollinger, fibLevels, volumeBars). Renderer
  `IndicatorPanel` : panneau prix + superpositions (moyennes, bandes, niveaux Fibonacci, guide de
  divergence) et sous-panneau à échelle propre (RSI 70/30, MACD histogramme+lignes, volume, oscillateur de
  divergence). Registre `indicatorConfigs.ts` (par variant) ; `SUPPORTED_VISUAL_TYPES` gagne `indicator`.
  **7 indicateurs** (famille `indicateur`) : moyennes mobiles, Bollinger, RSI, MACD, volume, Fibonacci,
  divergence. Galerie **64 figures / 7 familles**. Validations : lint · typecheck · tests **363** (+10) ·
  validate:content 31 · release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : 64 SVG,
  9 polylignes (2 moyennes + 3 Bollinger + RSI + 2 MACD + divergence), repères RSI·70/30 / MACD / prix ↑ /
  RSI ↓ / 61.8 % rendus, 0 erreur console. Voir **ADR-045**.
- **Suite (à faire)** : **Lot 5** — câbler un signal visuel sur chaque carte de quiz/exercice/révision et
  chaque concept, pour tenir l'objectif « toujours un signal de ce que c'est » partout. Commit local, **aucun push sans accord**.

---

## Date
2026-07-18 — **LOT 19 — Release readiness** terminé (après LOT 0 → LOT 18) —
**feuille de route `patternlab-product-growth` complète (Lots 0 → 19)**.

## Branche / commit
Branche de travail `claude/connexion-application-1n30su`. Dépôt distant `origin`
existant (`Mendestrading21/patternlab`) ; aucune poussée ni PR sans accord explicite.

## Fonctionnel
- App Expo SDK 57 (iOS/Android/web) qui démarre sur **web** (vérifiée en pilotant Chromium).
- Navigation Expo Router : Splash → Onboarding → Tabs (Accueil, Parcours, Laboratoire, Révisions, Profil) + routes Leçon, Session, Glossaire, Réussites, Statistiques, Premium, À propos.
- Design system sombre premium : tokens sémantiques + primitives (Text, Button, Card, ProgressBar, Chip, AnswerOption, FeedbackPanel, Screen, EmptyState).
- Personnages Toto (taureau vert) & Bobo (ours rouge) : figures 3D HD détourées + avatars vectoriels, via `CharacterAnimationController` (respecte « réduire les animations »).
- Moteurs découplés : apprentissage (répétition espacée SM-2 testée), exercices (registry, 9 formats), patterns (chart SVG reproductible).
- Tranche verticale jouable : onboarding → leçon → session de 5-6 exercices → feedback → XP/pièces → série → écran résultats → retour accueil.
- Parcours débloquable, module pilote « Lire un graphique » (4 compétences), révisions surfacées sur l'accueil, glossaire (24 termes), réussites (8 badges).
- Persistance locale (AsyncStorage) : niveau, XP, pièces, série, maîtrise ; réinitialisation.
- Validation de contenu contre les schémas JSON ; CI (lint/typecheck/test/contenu/build web) ; ADRs ; aucun secret ; aucune donnée personnelle WMB.

## LOT 0 — Fiabilité (ce lot)
Corrigé, sans régression, toutes validations vertes :
- **XP — source unique de vérité.** Le barème (`xpForGrade`/`coinsForGrade`/`levelForXp`) vit désormais dans le moteur. L'XP total progresse exactement du delta d'XP renvoyé par le moteur : plus aucune divergence possible entre l'XP par compétence (enregistré) et l'XP total (affiché). Le niveau est toujours recalculé depuis l'XP total.
- **Double attribution / déblocage.** Extraction d'une logique de progression **pure** (`src/data/progressLogic.ts`). Une compétence n'est débloquée que si la session est **réussie** (≥ 70 %) : impossible de gravir le parcours en échouant. Transitions idempotentes sur une journée (série non double-comptée, compétence jamais dupliquée).
- **Migrations de progression non destructives.** `migrateProgress` complète les champs manquants d'un ancien état au lieu de tout jeter à chaque changement de schéma ; niveau recalculé ; rejet des seuls schémas futurs inconnus ou données irrécupérables.
- **Documentation** remise à jour (ce fichier ; ADR-006).
- **Assets** inutiles/dupliqués supprimés (boilerplate Expo, figures non référencées, icônes d'onglets inutilisées) ; art source préservé.
- **Tests** ajoutés : `progressLogic`, `migration`, barème de récompense (42 tests au total, dont +17). Mock Jest AsyncStorage ajouté pour tester la couche données.
- **CI verte** rétablie : lint échouait sur l'outillage art local (`scripts/prepare-characters/*` important `playwright-core`, hors CI) — désormais exclu du lint applicatif.

## LOT 1 — Design System V2 (ce lot)
Identité **« Instrument Glass »**, sans régression, toutes validations vertes :
- **Palette** migrée vers graphite/bleu nuit (`background #0B1119`, surfaces élevées, accents `bullish #26C281` / `bearish #F05A67` / `technical #42B7E8`) ; clés sémantiques conservées → aucun écran réécrit ; `bullish/bearish` toujours distincts de `feedbackCorrect/incorrect`.
- **Accessibilité AA vérifiée par test** (`contrast.ts` + `contrast.test.ts`) : toutes les paires texte/surface ≥ 4.5 ; `textMuted` éclairci (`#8B99AB`).
- **Élévation** (`theme.elevation`) : profondeur « verre » discrète sur les cartes.
- **Primitives d'états** : `StateView` (loading/empty/error/offline/locked, un seul CTA), `Skeleton` (respecte reduced motion), `OfflineBanner` + hook `useIsOnline`. Intégrées réellement : chargement de l'accueil, garde-fou d'erreurs, bannière hors-ligne globale ; `EmptyState` délègue à `StateView`.
- **Couleurs web** alignées (HTML `theme-color`, `global.css`, manifest PWA).
- `useReducedMotion` centralisé dans le design system (source unique ; `@/characters` ré-exporte).
- Voir **ADR-007**.

## LOT 2 — Navigation (ce lot)
IA cible du skill, sans régression, toutes validations vertes :
- **Barre à 5 onglets** : Accueil · Parcours · **Laboratoire** · **Révisions** · Profil. Leçons/Quiz conservés comme routes hors barre (`href: null`), accessibles depuis l'accueil (Explorer) et les Leçons — aucun bouton mort.
- **Laboratoire** (nouvel écran) : chandeliers déterministes, figure Double Creux avec zone de confirmation et invalidation / faux signal, débat Toto/Bobo ; tracé interactif daté du Lot 8 (bouton désactivé + raison).
- **Révisions** (nouvel écran) : compétences dues (CTA), vue d'ensemble (maîtrise, prochaine échéance), état vide.
- **Accueil recentré** sur une **seule action principale** (`buildDailyMission` : révision due > apprentissage > terminé) ; progression compacte ; les révisions pointent vers l'onglet dédié.
- Dédoublonnage : l'aperçu Laboratoire quitte l'écran Leçons.
- Tests purs `dailyMission` ; routes typées régénérées ; PWA inchangée. Voir **ADR-008**.

## LOT 3 — Onboarding personnalisé (ce lot)
Flux personnalisé + modèle versionné, sans régression, toutes validations vertes :
- **Profil versionné** `OnboardingProfile` (objectif, niveau, temps 3/5/10 min, sujets, diagnostic, compétence de départ, `schemaVersion`) + migration + repository AsyncStorage **séparé** de la progression.
- **Flux en 7 étapes** : promesse + Toto/Bobo → objectif → niveau → temps → sujets → diagnostic éclair facultatif (3 questions, score) → récap avec **compétence de départ recommandée** ; indicateur d'étape, retour/continuer, sélections accessibles, un seul CTA par écran.
- **Recommandation pure** `recommendStartSkill` (le niveau fixe le départ ; un sujet peut ramener plus tôt mais jamais sauter un prérequis) — testée.
- **Première interaction avant compte/paywall** : « Commencer ma première leçon » → persiste le profil + marque l'onboarding + route vers `/session/{startSkillId}` (vérifié : `/session/skill.actions`).
- **Profil** (onglet) affiche le résumé + « Repersonnaliser ».
- **Analytics** : `onboarding_started`, `goal_selected`, `diagnostic_completed`, `path_generated`, `onboarding_completed`.
- Rétrocompatible (utilisateurs déjà onboarded sans profil → invite de personnalisation). Voir **ADR-009**.

## LOT 4 — Accueil mission du jour (ce lot)
Composition personnalisée, sans régression, toutes validations vertes :
- **Le temps quotidien pilote la longueur de session** : `exercisesForMinutes` (3→3, 5→5, 10→8) + `limitCount`, testées ; l'écran de session lit `count` (facultatif, rétrocompatible) et tronque la liste.
- **CTA principal personnalisé** : la mission route vers `/session/[skillId]?count=…` (depuis l'accueil ET la fin d'onboarding — vérifié : `?count=3` → « Exercice 1 / 3 »). Sous-titre d'accueil = objectif + temps du profil ; carte mission = `~N min` + `N exercices`.
- **Progression compacte** (niveau, série, pièces, XP) dans la carte mission.
- **Révision due** : pointeur compact vers l'onglet Révisions.
- **Allègement** : suppression de la section décorative « Les 4 piliers » ; conservation des Défis, de l'Explorer (Leçons/Quiz/Glossaire/Réussites) et des Conseils Toto/Bobo.
- Voir **ADR-010**.

## LOT 5 — Parcours immersif (ce lot)
Carte à nœuds + checkpoint, sans régression, toutes validations vertes :
- **Carte pure** `buildWorldMap` : nœuds (compétences + **checkpoint** de fin de module) avec statuts done / current / **due** / locked ; checkpoint verrouillé tant que les 4 compétences ne sont pas terminées. Testée.
- **Checkpoint = revue mixte** : `getExercises('checkpoint.read-chart')` agrège des exercices de chaque compétence (skillId réel conservé → maîtrise réelle mise à jour) ; `skillById` donne un titre dédié ; lecteur de session **inchangé** ; événement `checkpoint_completed`.
- **UI immersive** (`parcours.tsx`) : en-tête de monde (« Monde 1 · Fondations »), mascotte, barre de progression, **trail** relié par un connecteur vertical, badges statués, révisions dues surlignées, nœud checkpoint distinct ; accessibilité (rôles/états/hints) + état loading.
- Voir **ADR-011**.

## LOT 6 — Leçons V2 (ce lot)
Steps enrichis + flashcards, sans régression, toutes validations vertes :
- **Modèle de step étendu** (rétrocompatible) : `intro` (hook), `observe`, `chart`, `warning`, `falseSignal`, `flashcard` en plus des existants ; `body` optionnel ; `chartSeed` + `flashcard {front, back}`. Schéma JSON inchangé (permissif sur `kind`).
- **Contenu enrichi** : leçons pilotes (action, bougie, double creux) en V2 — hook → observation → **graphique** (PatternChart déterministe) → **faux signal** → résumé → **flashcard**.
- **Composant `Flashcard`** (design system) : réponse révélée au toucher, sans animation (reduced-motion safe), accessible.
- **Écran leçon** : rendu par kind (accents dédiés : faux signal bearish, résumé primaire, warning ambre) ; chips durée/difficulté.
- **Helper pur `lessonContent`** (`flashcardsForSkill` / `allFlashcards`), testé — brique réutilisable pour les révisions.
- Voir **ADR-012**.

## LOT 7 — Exercices avancés (ce lot)
Deux nouveaux formats branchés (grader pur + renderer + tests), sans régression :
- **`scenario`** (SI/ALORS) : contexte mis en avant + options ; `validation.correctIndex`.
- **`select_chart_zone`** : graphique en chandeliers avec **zones tappables superposées** (boutons accessibles), sélection/correction colorées, tap simple (fallback natif), sans animation.
- Contenu pilote : `select_chart_zone` (skill.trend), `scenario` (skill.patterns) ; libellés de format dans la session.
- **9 formats** branchés (les formats à tracé/replay relèvent du Lot 8). Voir **ADR-013**.

## LOT 8 — Laboratoire interactif (ce lot)
Prototype interactif + benchmark, sans régression, toutes validations vertes :
- **Benchmark moteur graphique** (react-native-svg / Skia / Canvas) → **ADR-014** : rester sur `react-native-svg` (aucune dépendance ajoutée) ; logique d'échelle **extraite en fonctions pures** → un futur Skia ne réécrira que le renderer.
- **Cœur interactif pur** `interactive.ts` : échelle prix↔Y, support/résistance cibles, tolérance — testés.
- **`InteractiveChart`** (SVG) : tracé d'un niveau horizontal au **tap** (souris/touch) **ou** aux flèches ↑/↓ (accessible / fallback gestes).
- **Premier scénario « trace le support »** : validation avec tolérance, **correction visuelle** (ligne cible + feedback Toto/Bobo), réinitialisation. Analytics `lab_started`/`lab_completed`.
- Voir **ADR-014**.

## LOT 9 — Maîtrise adaptative (ce lot)
Statuts + errorTags + migration v3, sans régression, toutes validations vertes :
- **Statut de maîtrise** pur `masteryStatus` : new → learning → fragile → reviewing → strong → mastered (dérivé de mastery/confidence/rappels, jamais d'une seule réponse). Testé.
- **errorTags** sur `SkillProgress` : sur mauvaise réponse, la session enregistre l'id de l'exercice (`recordAnswer(..., tag)`) ; `errorCount` agrège. La révision est déjà rapprochée par le moteur (échec → dueAt = now).
- **Migration v3** (`PROGRESS_SCHEMA_VERSION = 3`) : `errorTags = {}` par défaut (v2 → v3 sans perte), assainissement des entrées. Testée.
- **Surfaçage** : chip de statut + « X erreurs à retravailler » dans Révisions ; chip de statut dans Profil.
- Voir **ADR-015**.

## LOT 10 — Toto/Bobo V2 (ce lot)
Registre d'états + fréquence contrôlée, sans régression, toutes validations vertes :
- **Registre d'états canonique** `CHARACTER_STATES` (source unique : expression, personnage par défaut, catégorie, intensité, ton) ; `STATE_TO_EXPRESSION` **dérivé** (plus de duplication) ; `mascotFor()`. Couvre les états du skill (welcome, observe, false-signal, review, premium, debate, level-up, streak…).
- **Intensité d'animation** pilotée par le registre (still/subtle/lively), toujours désactivée si reduced motion.
- **Gouverneur de fréquence** `frequency.ts` (pur, testé) : `mascotPresence` → full/compact/hidden ; discret dans listes denses / réglages / interactions graphiques. Appliqué dans Révisions (mascotte compacte).
- Nouveaux états câblés : `welcome` (onboarding), `false-signal` (labo), `review` (Révisions).
- Voir **ADR-016**.

## LOT 11 — Migration APP pilote (ce lot)
Pipeline de contenu + schéma + brouillons, sans régression, toutes validations vertes :
- **Cœur pur et testé** `src/content/importPipeline.ts` : hash de contenu, normalisation, classification (5 catégories), garde `hasPersonalData`, brouillon `needsReview` (origine + hash), déduplication.
- **Runner** `scripts/import-app/index.mjs` (`npm run import:app`) : réutilise le pipeline via l'exécution TS native de Node 22 (une seule source), **idempotent** (contenu inchangé → non réécrit).
- **Schéma** `schemas/concept.schema.json` ; `validate:content` valide aussi `content/drafts/concepts/`.
- **Pilote** : 18 concepts (5 catégories) importés en `needsReview`, tracés (sourcePath/hash/importedAt), **zéro donnée personnelle** ; l'app n'importe jamais ce contenu (build-time only, APP reste une source).
- **Revue humaine** requise avant publication. Voir **ADR-017**.

## LOT 12 — Glossaire enrichi (ce lot)
Recherche tolérante + catégories + fiches reliées, sans régression, toutes validations vertes :
- **Recherche pure, testée, insensible aux accents/casse** `src/data/glossarySearch.ts` : `normalizeSearch` (NFD + retrait des diacritiques) et `searchGlossary` classant par pertinence (début du terme > terme > anglais > résumé, départage alphabétique) après filtre de catégorie. Vérifié en pilotant Chromium : « volatilite » (sans accent) → « Volatilité » en tête.
- **Liens du modèle** : `GlossaryTerm` gagne `relatedSkillId?` / `related?`, maintenus dans une table séparée `GLOSSARY_LINKS` fusionnée à l'export `GLOSSARY_TERMS` (définitions lisibles, liens centralisés).
- **Fiche reliée à la pratique** : bouton « S'entraîner — {compétence} » → `/session/{skillId}` et carte « Termes reliés » (puces navigables terme↔terme), affichés uniquement si le lien existe (zéro bouton mort), accessibles.
- **Légende honnête** : « N termes sur M · le vocabulaire essentiel des marchés » (fin du « 1 111+ » trompeur) ; l'écran liste consomme `searchGlossary`.
- **Intégrité par test** : chaque `related` existe et n'est pas auto-référent ; chaque `relatedSkillId` pointe vers une compétence réelle (un lien cassé casse la CI).
- Catégories recolorées « Instrument Glass ». Voir **ADR-018**.

## LOT 13 — Gamification (ce lot)
Quêtes du jour rémunérées + jalons de série + réussites, sans régression, toutes validations vertes :
- **Registre d'activité du jour** (schéma **v4**) : `daily {date, sessions, correct, xp}` remis à zéro chaque jour ; migration non destructive (défauts sûrs + assainissement), aucune perte de progression.
- **Moteur pur et testé** `src/data/gamification.ts` : `buildDailyQuests` (3 quêtes stables adossées au registre réel), `claimQuest` (récompense en pièces, **idempotent** par jour), `streakInfo`/`applyStreakMilestones` (paliers 3/7/14/30/60/100, +15 🪙 une seule fois), `newlyEarnedBadges` (détection de badge obtenu).
- **Câblage** (`progressContext`) : chaque réponse nourrit le registre (XP réel + bonne réponse) ; chaque session est comptée et crédite les jalons franchis ; `claimQuest` exposé. Analytics ajoutés : `quest_completed`, `achievement_unlocked`.
- **UI honnête, zéro bouton mort** : l'accueil remplace les faux « Défis » par les vraies quêtes (progression + bouton **Réclamer +N 🪙** actif seulement si terminé) ; l'écran Réussites gagne une carte **Série** (jalon suivant + récompense). Aucune mécanique manipulatrice (pas de vie punitive, pas de casino, pas de pari).
- Vérifié en pilotant Chromium : réclamation d'une quête → pièces 20 → 25 et « Réclamé ✓ » ; carte Série « encore 3 jours jusqu'au jalon 7 · +15 🪙 ». Voir **ADR-019**.

## LOT 14 — Statistiques (ce lot)
Historique d'activité + tableau de bord, sans régression, toutes validations vertes :
- **Historique d'activité** (schéma **v5**) : `history: DailySnapshot[]` ; le basculement de jour (`rolled`) archive le registre écoulé (dédupliqué par date, borné à 60 jours). Migration non destructive (défauts + assainissement), aucune perte de progression.
- **Moteur pur et testé** `src/data/stats.ts` : `computeStats` agrège vue d'ensemble, maîtrise par compétence + répartition des statuts, erreurs récurrentes (agrégées et rattachées à la compétence), et série d'activité N jours (historique + jour courant, avec `windowXp`/`activeDays`/`peakXp`). Aucune donnée inventée.
- **Écran** `/statistiques` : vue d'ensemble, **graphique d'activité 7 jours** (barres en Views pures, sans dépendance ni animation, étiquetées pour lecteurs d'écran, aujourd'hui mis en avant), maîtrise par compétence, erreurs à retravailler → bouton **Réviser**. Accessible depuis le Profil (« Voir le détail 📊 »). Analytics `stats_viewed`.
- Vérifié en pilotant Chromium : vue d'ensemble (niv. 2, 160 XP, 5 j, 1/4, 98 XP/7 j), barres 7 jours (aujourd'hui en vert), statuts Maîtrisé/Fragile/En cours/Nouveau, erreurs par compétence + bouton Réviser. Voir **ADR-020**.

## LOT 15 — Monétisation (ce lot)
Offre gratuit/premium + paywall + entitlement simulé, sans régression, toutes validations vertes :
- **Modèle pur et testé** `src/data/premium.ts` : `PRICING` (Pass Fondateur 14,99 · Annuel 44,99 · Mensuel 7,99 CHF — hypothèses configurables), `PREMIUM_FEATURES` / `FREE_FEATURES`, `PremiumState {active, plan, since, demo}` avec `isPremium`/`activate`/`deactivate`/`migratePremium`. **`demo` toujours vrai** : activation simulée, jamais un achat réel, aucune donnée de paiement, aucun Stripe.
- **Persistance séparée** `premiumRepository` (clé `patternlab.premium.v1`) chargée/enregistrée par `progressContext` ; exposé via `premium`/`activatePremium`/`deactivatePremium`/`restorePremium`.
- **Paywall** `/premium` : premium vs gratuit, cartes d'offres sélectionnables (Pass Fondateur mis en avant), CTA **« Activer — {offre} (démo) »**, « Restaurer », « Plus tard », avertissement explicite « Simulation — aucun achat réel ». État « Tu es Premium » + « Désactiver (démo) » si actif. Zéro bouton mort.
- **Un gate réel, non punitif** : les **statistiques détaillées** deviennent premium, la **vue d'ensemble reste gratuite** ; le gate n'apparaît qu'à l'ouverture des stats (après interaction), jamais au démarrage. Le cœur d'apprentissage reste entièrement gratuit. Entrée Premium depuis le Profil.
- **Analytics** : `premium_gate_hit`, `paywall_viewed`, `subscription_started`, `subscription_restored`.
- Vérifié en pilotant Chromium : stats gratuites → gate → paywall (Pass Fondateur, avertissement simulation) → « Activer » → « Tu es Premium » → stats détaillées débloquées. Voir **ADR-021**.

## LOT 16 — Analytics étendus (ce lot)
Couche typée, indépendante du fournisseur, privacy-first, sans régression, toutes validations vertes :
- **Taxonomie complétée** `src/analytics/events.ts` : liste essentielle du skill (app_opened, daily_mission_*, interaction_*, hint_requested, false_signal_identified, mastery_changed, glossary_searched, concept_viewed, favorite_added, subscription_expired…). `EVENT_CATEGORIES` source unique (lifecycle/onboarding/learning/engagement/monetization) ; test d'exhaustivité.
- **Confidentialité pure et testée** `src/analytics/privacy.ts` : `sanitizeProps` retire les clés PII/financières (email, iban, card, stripe, balance, montant, compte, broker, position…), rédige les e-mails, borne chaînes (120) et nombre de propriétés (24). Appliquée à **chaque** évènement. `glossary_searched` n'émet que `queryLength`, jamais le texte.
- **Dispatcher indépendant du fournisseur** `src/analytics/analytics.ts` : pipeline consentement → assainissement → diffusion vers des puits enregistrables (`ConsoleSink` dev, `MemorySink` borné). Un puits qui échoue n'interrompt jamais l'app. Brancher un fournisseur = un puits de plus.
- **Consentement opt-out persistant** `consentRepository` (`patternlab.consent.v1`, true par défaut) appliqué **avant** toute émission ; bascule dans le Profil (carte Confidentialité, `role=switch`). Non réinitialisé par « Réinitialiser ma progression ».
- **Évènements câblés** : app_opened, glossary_searched (longueur seulement), concept_viewed, daily_mission_started, mastery_changed.
- Vérifié en pilotant Chromium (console dev) : `glossary_searched {queryLength: 10, …}` sans le texte brut ; consentement coupé → 0 évènement diffusé. Voir **ADR-022**.

## LOT 17 — Offline complet (ce lot)
Connectivité branchable + local-first assumé, sans régression, toutes validations vertes :
- **Connectivité branchable et testée** `src/lib/connectivity.ts` : `ConnectivityStore` (magasin observable pur, ne notifie que sur changement réel), `bindPlatformSource` (web `navigator.onLine` + événements ; natif supposé en ligne, NetInfo en drop-in sans changer les appelants), singleton + hook `useConnectivity()`. Remplace `useIsOnline` (supprimé) ; bandeau global migré.
- **Disponibilité hors-ligne garantie et visible** `src/data/offline.ts` : `offlineCapabilities()` (pur) résume le contenu embarqué (compétences/leçons/exercices/glossaire/badges) + `contentReady`/`progressLocal`. Testé (tout le parcours dispo sans réseau). Carte « Mode hors-ligne » dans le Profil avec statut de connexion en direct.
- **Un vrai garde-fou réseau** : sur le paywall, « Activer »/« Restaurer » désactivés hors-ligne avec raison explicite (« Connexion requise pour finaliser un achat ») — modélise le futur achat réel. Le reste de l'app reste pleinement utilisable hors-ligne (zéro bouton mort).
- Vérifié en pilotant Chromium (offline réel via `setOffline`) : bandeau hors-ligne apparaît/disparaît, statut Profil bascule En ligne/Hors ligne, CTA d'achat gaté hors-ligne, navigation + apprentissage OK sans réseau. Voir **ADR-023**.

## LOT 18 — Accessibilité complète (ce lot)
Contraste verrouillé + titres + focus clavier + cibles tactiles, sans régression, toutes validations vertes :
- **Contraste AA exhaustif** (`contrast.test.ts`) : chaque couleur de texte neutre ≥ 4.5 sur **toutes** les surfaces (fonds profonds inclus), chaque accent-texte (primary/technical/warning/reward/bullish/bearish/neutral/primaryBright) ≥ 4.5 sur les surfaces de carte. Toutes les paires réellement utilisées passent — aucun token changé ; toute dérive future casse la CI.
- **Jetons/aides a11y purs et testés** `src/design-system/a11y.ts` : `minTouchTarget=44`, `maxFontScale=1.8`, `hitSlopFor`, `decorative`, `isHeadingVariant`.
- **Titres annoncés** : le primitif `Text` donne `role=header` au seul `h1` (un titre de navigation par écran) ; `h2`/`display` (grands nombres, emojis, icônes) volontairement non-titres pour ne pas polluer la navigation.
- **Polices dynamiques** honorées via `maxFontSizeMultiplier` (1.8, surchargeable). **Cibles tactiles** : `hitSlopFor` sur les petites puces (catégories glossaire, termes reliés). **Clavier web** : anneau `:focus-visible` (2 px) + `prefers-reduced-motion` global. **Décor masqué** : `MascotFigure decorative` (mission/réussites/premium retirés de l'arbre AT).
- Vérifié en pilotant Chromium : exactement **1 titre par écran** (h1), boutons exposés `role=button`, focus clavier avec anneau visible (2 px solid), mascotte décorative masquée. Voir **ADR-024**.

## LOT 19 — Release readiness (ce lot)
Config de publication + légal in-app + porte `release:check`, sans régression, toutes validations vertes :
- **Config `app.json`** : nom `PatternLab`, `userInterfaceStyle: dark`, couleurs de marque (splash/adaptive/`backgroundColor`/`primaryColor`), identifiants reverse-DNS `com.patternlab.app` (iOS/Android), `supportsTablet`, compliance chiffrement iOS, `description`. Assets vérifiés présents.
- **Source unique** `src/lib/appInfo.ts` (sans import, importable app + Node) : `APP_INFO`, `PRIVACY_SUMMARY`, `LEGAL_LINES` ; `config.ts` en dérive.
- **Écran légal `/a-propos`** : version, disclaimer, résumé de confidentialité, mentions légales ; lié depuis le Profil (remplace le bouton « Réglages » mort). Politique complète `docs/PRIVACY.md`.
- **Porte de publication** : logique pure testée `src/release/releaseCheck.ts` (13 invariants) + runner `scripts/release-check.mjs` (`npm run release:check`, exécution TS native Node 22), ajouté à la porte de validation. Checklist honnête `docs/RELEASE_CHECKLIST.md` (automatisé vs action humaine requise).
- Vérifié : `release:check` 13/13 ; écran À propos rendu en pilotant Chromium (version, disclaimer, confidentialité, mentions légales). Voir **ADR-025**.

## Partiel
- Gamification : quêtes du jour + jalons de série + détection de badge obtenu en place. La **célébration visuelle** (toast/modale à l'obtention) est encore réduite à l'analytics `achievement_unlocked` ; l'écran Réussites reste le lieu de constat. Quêtes hebdomadaires et coffres non couverts (base extensible).
- Lottie : dépendance + point d'intégration prêts ; rendu figures/SVG en attendant (ADR-005).
- Import APP : pilote de 18 concepts curatés ; extraction de l'export APP réel (`02_DATA_EDUCATIVES`) + montée vers 50+ = alimenter le dossier `source/` (pipeline inchangé). Le registre V2 prépare la bascule (renderer remplaçable sans toucher aux états).
- Adaptation intra-session (re-séquencement des exercices ratés) : à affiner ; la base errorTags + révision rapprochée est en place.
- Labo : un scénario (support) ; zoom/pan, zone rectangulaire, volume et replay à venir (base `interactive.ts` extensible).
- Formats restants (drag_drop, draw_level, place_invalidation, reconstruct_ohlc, candle_replay, timed_challenge, compare_setups) : à brancher progressivement (garde-fou actif).
- Flashcards rendues dans la leçon ; leur surfaçage en révision autonome viendra avec un lot ultérieur.
- Parcours : un seul monde/module pour l'instant ; l'ajout de mondes ne demandera pas de réécrire la carte (contenu piloté).
- Détection réseau : abstraction branchable en place (web opérationnel, natif supposé en ligne). La source native `@react-native-community/netinfo` reste à brancher (drop-in, sans changer les appelants). File de synchronisation vers un backend : non nécessaire (local-first, aucun backend) — l'entitlement/achat réel restera le seul point réseau.
- Laboratoire : aperçu lisible ; tracé/comparaison/replay interactifs au Lot 8.
- Exercices : 9 formats sur 12 branchés (restent : drag_drop, draw_level, timed — + variantes replay/OHLC).
- Contenu : ~8 leçons / ~20 exercices — à étoffer vers 30-40 leçons / 100-150 exercices.
- `bobo-warning` : figure enregistrée dans `IMAGES` mais pas encore affichée (conservée volontairement).

## Cassé
- Aucun connu (voir sorties lint / typecheck / test / validate:content / build web).

## Absent (par design — hors périmètre agent, autorisation requise)
- Feuille de route `patternlab-product-growth` **complète (Lots 0 → 19)**.
- Publication réelle : comptes Apple/Google, EAS build/soumission, magasin d'achat réel,
  fournisseur analytics/crash externe, source native NetInfo — voir `docs/RELEASE_CHECKLIST.md`
  (« action humaine requise »). Rien de tout cela n'est réalisé sans accord explicite.
- Builds device iOS/Android (EAS + comptes Apple/Google).

## Prochaine priorité
**Feuille de route croissance produit terminée (Lots 0 → 19).** Suites possibles, sur accord :
- **Publication** : dérouler `docs/RELEASE_CHECKLIST.md` (« action humaine requise ») — EAS,
  comptes stores, captures, soumission.
- **Contenu** : brancher les 18 concepts importés (après revue humaine) et étoffer vers
  30-40 leçons / 100-150 exercices ; nouveaux mondes.
- **Finitions** : célébration visuelle des réussites (toast/modale), historique 30 jours,
  écran « journal analytics » (dev), sémantique de section (`h2`) pour l'a11y, branchements
  natifs réels (NetInfo, analytics, achats) — tous conditionnés à autorisation.

## Risques
- Conteneur éphémère : commit local présent ; pousser après accord pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
