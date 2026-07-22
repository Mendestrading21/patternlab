import type { ConfigContext, ExpoConfig } from 'expo/config';

import deployment from './config/deployment.json';

/**
 * Configuration dynamique minimale.
 *
 * `app.json` décrit l'identité PatternLab. Le chemin GitHub Pages appartient à
 * l'infrastructure du dépôt TradeMy et n'a qu'une source de vérité :
 * `config/deployment.json`.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'PatternLab',
  slug: config.slug ?? 'patternlab',
  experiments: {
    ...config.experiments,
    baseUrl: deployment.webBasePath,
  },
  extra: {
    ...config.extra,
    deployment: {
      webBasePath: deployment.webBasePath,
      publicUrl: deployment.publicUrl,
    },
  },
});
