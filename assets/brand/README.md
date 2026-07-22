# Identité visuelle PatternLab

`app-icon-source.jpeg` est la source canonique de l’icône Toto/Bobo.

Les exports utilisés par Expo et la PWA restent volontairement dans les emplacements attendus par
les outils (`assets/images/` et `public/`). Leur dimension et leur empreinte sont verrouillées par
`asset-manifest.json` et contrôlées avec `npm run verify:brand`.

Pour remplacer l’icône, modifier d’abord la source canonique, régénérer tous les exports, puis mettre
à jour le manifeste dans le même commit. Ne jamais réintroduire les icônes Expo par défaut.
