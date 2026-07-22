# Build et distribution — PatternLab

## Environnement

Utiliser la version Node de `.nvmrc` pour le développement, la CI et GitHub Pages.

```bash
npm ci
npm run check
```

## Web / PWA

```bash
npm run build:web
```

Le build :

1. génère `public/manifest.json` depuis `config/web-manifest.json` ;
2. lit le chemin public unique dans `config/deployment.json` ;
3. exporte les routes Expo dans `dist/` ;
4. ajoute le fallback `404.html` et `.nojekyll` pour les accès directs GitHub Pages ;
5. vérifie chaque page HTML et chaque ressource sous `/TradeMy/`.

Les icônes Toto/Bobo sont vérifiées par `npm run verify:brand`. Pour un autre hébergement, modifier
la configuration de déploiement dans une branche dédiée et exécuter la gate complète.

## Android et iOS

Les builds signés nécessitent le compte Expo et les comptes développeur du propriétaire.

```bash
eas build -p android --profile preview
eas build -p ios --profile production
eas build -p android --profile production
```

La soumission aux stores, les credentials et tout achat réel exigent une autorisation explicite.
Consulter `docs/RELEASE_CHECKLIST.md` et `docs/RELEASE_READINESS.md` avant une release.
