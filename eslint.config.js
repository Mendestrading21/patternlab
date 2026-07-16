// ESLint 9 flat config — base Expo.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'dist/**',
      '.expo/**',
      'node_modules/**',
      'scripts/reset-project.js',
      'expo-env.d.ts',
      'babel.config.js',
    ],
  },
];
