# Build & distribution — PatternLab

Trois façons d'utiliser l'app, de la plus rapide à la plus « store ».

## 1. Web / PWA (utilisable tout de suite, vrais icônes)

```bash
npm run build:web       # produit dist/ (baseUrl /patternlab par défaut)
```

Le dossier `public/` fournit les vrais icônes PWA (Toto & Bobo) : `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`, `manifest.json`.

Pour un artefact **portable servi à la racine** (le zip déjà livré) : builder avec
`experiments.baseUrl` = `/`, puis héberger `dist/` (ex. glisser le dossier sur
<https://app.netlify.com/drop>). Sur mobile : ouvrir l'URL → « Ajouter à l'écran
d'accueil » → l'icône PatternLab apparaît, l'app s'ouvre en plein écran.

## 2. APK Android (installable, hors store)

Nécessite un compte **Expo** (gratuit). Depuis la machine :

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview     # → .apk téléchargeable, à sideloader
```

Le profil `preview` (voir `eas.json`) produit un **APK** d'installation directe.

## 3. Stores App Store / Google Play (production)

Nécessite : compte **Apple Developer** (99 $/an), compte **Google Play** (25 $ une
fois), et EAS.

```bash
eas build -p ios --profile production        # .ipa signé (credentials Apple)
eas build -p android --profile production    # .aab (Google Play)
eas submit -p ios --profile production
eas submit -p android --profile production
```

Identifiants déjà configurés dans `app.json` : `ios.bundleIdentifier` /
`android.package` = `com.patternlab.app`, version `1.0.0`, thème sombre, splash + icônes
de marque, compliance chiffrement iOS.

## Avant chaque build — porte de validation

```bash
npm run lint && npm run typecheck && npm test -- --runInBand \
  && npm run validate:content && npm run release:check && npm run build:web
```

> Les étapes 2 et 3 nécessitent **tes** comptes/credentials et une décision de
> publication. Elles ne sont jamais réalisées sans ton accord explicite
> (voir `docs/RELEASE_CHECKLIST.md`).
