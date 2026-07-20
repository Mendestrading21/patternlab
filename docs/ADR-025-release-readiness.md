# ADR-025 — Release readiness (config, légal, porte de publication)

## Statut
Accepté (LOT 19 — Release readiness, skill `patternlab-product-growth`). Dernier lot de la
feuille de route croissance produit.

## Contexte
`app.json` portait des valeurs de gabarit Expo (nom en minuscules, splash/adaptive icon
bleu clair incohérents avec la marque sombre, `userInterfaceStyle: automatic`, **pas
d'identifiants de store**). Aucun écran légal/confidentialité in-app, aucune vérification
automatisée de préparation à la publication. Le skill exige une accessibilité **et** une
préparation à la publication vérifiables, sans fabriquer de credentials ni publier sans
accord.

## Décision
1. **Config de publication** (`app.json`) : nom d'affichage `PatternLab`, `userInterfaceStyle:
   dark` (cohérent avec « Instrument Glass »), couleurs de marque (splash / adaptive icon /
   `backgroundColor` / `primaryColor`), **identifiants reverse-DNS** `com.patternlab.app`
   (iOS `bundleIdentifier`, Android `package`), `supportsTablet`, compliance chiffrement iOS
   (`ITSAppUsesNonExemptEncryption: false`), `description`. Assets existants (icône, splash,
   adaptive, favicon, `.icon` iOS) vérifiés présents.
2. **Source unique de métadonnées** `src/lib/appInfo.ts` (feuille du graphe, **sans import**,
   donc importable par l'app RN comme par le runner Node) : `APP_INFO` (nom, version,
   tagline, disclaimer), `PRIVACY_SUMMARY`, `LEGAL_LINES`. `config.ts` en dérive (nom /
   tagline / disclaimer) — un seul endroit à modifier, aucune divergence.
3. **Écran légal in-app** `/a-propos` : version, disclaimer éducatif, résumé de
   confidentialité (aucune donnée personnelle, progression locale, opt-out analytics, aucun
   conseil), mentions légales. Lié depuis le Profil (remplace le bouton « Réglages » mort).
   Politique complète `docs/PRIVACY.md`.
4. **Porte de publication automatisée** : logique **pure et testée** `src/release/
   releaseCheck.ts` (13 invariants : identité, versions synchronisées app.json = package.json
   = APP_INFO, identifiants reverse-DNS, assets présents, expo-router, disclaimer/privacy/écran
   À propos). Runner `scripts/release-check.mjs` (exécution TS native Node 22, comme
   `import:app`) → `npm run release:check`. Ajouté à la porte de validation.
5. **Checklist honnête** `docs/RELEASE_CHECKLIST.md` : sépare l'**automatisé** (vérifiable
   maintenant) de l'**action humaine requise** (comptes Apple/Google, EAS, captures, revue,
   soumission, magasin d'achat réel) — **jamais réalisé sans autorisation explicite**.

## Conséquences
- Préparation à la publication **opposable** : un invariant cassé (version désynchronisée,
  identifiant manquant, asset absent, écran légal retiré) fait échouer `release:check` et la
  CI, avant tout build de store.
- Surface légale/confidentialité présente et cohérente avec le positionnement éducatif.
- Ce qui exige un humain (credentials, soumission, achat réel) est explicitement listé, non
  simulé ni contourné.

## Rollback
`appInfo.ts`, `releaseCheck.ts`, le runner et l'écran `/a-propos` sont additifs ; revenir en
arrière = retirer le script `release:check` et le lien Profil. Les changements `app.json`
sont des métadonnées (aucun impact sur la logique runtime).
