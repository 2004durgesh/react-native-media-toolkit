// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    settings: {
      'import/resolver': {
        node: {
          paths: ['../lib/module', '../src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },
    rules: {
      // Disable import/no-unresolved for workspace modules
      'import/no-unresolved': ['error', { ignore: ['^react-native-media-toolkit$'] }],
    },
  },
]);