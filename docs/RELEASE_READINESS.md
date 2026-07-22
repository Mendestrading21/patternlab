# Préparation à la publication — PatternLab V5

Checklist finale de préparation à la publication (iOS / Android / web). Distingue ce qui est
**automatisé et vérifié en CI** de ce qui reste **manuel** (soumission store, hébergement, revue).

## 1. Porte automatisée canonique

```bash
npm ci
npm run check
```

Cette gate couvre lint, TypeScript, tests, validation du contenu, configuration de release, identité
de marque, build web et résolution réelle des ressources sous le chemin GitHub Pages. Le statut vert
doit être prouvé dans le commit/PR courant ; les anciens nombres de tests ne valent pas validation.

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

**Go côté ingénierie** seulement si `npm run check` passe sur la révision candidate et si les
invariants de conformité, d’accessibilité, d’offline et de non-publication automatique restent verts.
La publication effective dépend des étapes manuelles §4 et de l’accord explicite d’Elio.
