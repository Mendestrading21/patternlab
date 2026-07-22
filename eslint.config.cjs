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
    // Setup Jest (mock AsyncStorage) : global `jest` disponible.
    files: ['jest.setup.cjs'],
    languageOptions: {
      globals: { jest: 'readonly', require: 'readonly' },
    },
  },
  {
    ignores: [
      'dist/**',
      '.expo/**',
      'node_modules/**',
      'expo-env.d.ts',
      'babel.config.cjs',
    ],
  },
];
