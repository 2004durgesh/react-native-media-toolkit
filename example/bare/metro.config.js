const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../../package.json');

const root = path.resolve(__dirname, '../..');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  root,
  pkg,
  project: __dirname,
});
