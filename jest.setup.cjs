// Mock officiel AsyncStorage pour Jest : permet de tester la couche données
// (repositories, migration, progression) sans module natif.
// https://react-native-async-storage.github.io/async-storage/docs/advanced/jest
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
