// ESLint 9 flat config — base Expo.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    // Scripts d'outillage Node (préparation d'assets, etc.)
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: { Buffer: 'readonly', process: 'readonly', console: 'readonly' },
    },
  },
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
