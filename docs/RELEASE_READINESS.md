# Préparation à la publication — PatternLab V5

Checklist finale de préparation à la publication (iOS / Android / web). Distingue ce qui est
**automatisé et vérifié en CI** de ce qui reste **manuel** (soumission store, hébergement, revue).

## 1. Portes automatisées (CI-équivalent) — toutes vertes

| Porte | Commande | État |
|---|---|---|
| Lint | `npm run lint` | ✅ |
| Types (TS strict) | `npm run typecheck` | ✅ |
| Tests unitaires | `npm run test` | ✅ 417 tests (programme Experience Max inclus) |
| Validation de contenu | `npm run validate:content` | ✅ 31/31 (+ portail éditorial : idempotence, vocabulaire, needsReview) |
| Préparation publication | `npm run release:check` | ✅ 14/14 |
| Build web | `npm run build:web` | ✅ export `dist` |

## 2. Invariants produit garantis par test

- **Vocabulaire éducatif** : aucun BUY/SELL ni promesse de gain — garanti par `conceptVocabularyIssues`
  (contenu in-app) et par le portail de `validate:content` (brouillons éditoriaux).
- **Contenu jamais auto-publié** : tout le contenu V5 est `needsReview` (in-app + éditorial) ; la
  vérification `release:check` bloque si un brouillon est `approved`/`published`.
- **Intégrité du contenu** : ids/slugs uniques, mondes/catégories/relations valides
  (`checkConceptsIntegrity`, `contentFactory.test`).
- **Visuels rendables** : chaque `VisualSpec` a un type supporté + un dataset présent (`visualDatasets.test`).
- **Accessibilité** : contraste AA verrouillé (`contrast.test`), cibles/en-têtes/décoratif (`a11y.test`),
  résumés accessibles des graphiques (`describeCandles`, résumés des visuels). Voir `ACCESSIBILITY.md`.
- **Zéro bouton mort** : les états désactivés exposent une raison ; les entrées Premium mènent à un gate honnête.
- **Offline** : tout le contenu (parcours + V5 : concepts, visuels générés en code, mondes) embarqué
  (`offline.test`).
- **Analytics** : opt-out, anti-PII, journal de transparence local.
- **Monétisation** : démo locale, aucun achat réel, aucune donnée de paiement.

## 3. Config app (vérifiée par `release:check`)

Nom/slug/orientation, thème sombre cohérent, versions synchronisées (app.json = package.json =
APP_INFO), bundleIdentifier iOS + package Android (reverse-DNS), icône + favicon présents, plugin
expo-router, disclaimer éducatif, résumé de confidentialité (≥ 3 points), écran « À propos »,
contenu V5 en revue.

## 4. Étapes MANUELLES (non automatisables ici)

- [ ] Build natif signé via **EAS** (iOS `.ipa` / Android `.aab`) — profil de build configuré.
- [ ] Comptes développeur Apple / Google Play, certificats et provisioning.
- [ ] Fiches store : titre, descriptions, mots-clés, captures d'écran (par taille d'appareil), vidéo.
- [ ] **Politique de confidentialité hébergée** (URL) + questionnaire de confidentialité App Store /
      Data safety Google Play (aucune donnée personnelle collectée ; suivi anonyme opt-out).
- [ ] Classification d'âge et catégorie (Éducation / Finance éducative).
- [ ] Bêta (TestFlight / Play internal testing) avant production.
- [ ] Revue humaine finale du contenu V5 avant de faire passer des concepts de `needsReview` à publié.

## 5. Go / No-Go

**Go côté ingénierie** : toutes les portes automatisées sont vertes ; les invariants de conformité,
d'accessibilité, d'offline et de non-publication automatique sont garantis par test. La publication
effective dépend des étapes manuelles §4 (build signé, fiches store, revue humaine) et de l'accord
explicite (aucun push ni publication sans accord).
