const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../../package.json');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const root = path.resolve(__dirname, '../..');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const baseConfig = wrapWithReanimatedMetroConfig(getConfig(getDefaultConfig(__dirname), {
  root,
  pkg,
  project: __dirname,
}));

// Merge in custom resolver options
module.exports = {
  ...baseConfig,
  resolver: {
    ...(baseConfig.resolver || {}),
    platforms: ['native', 'android', 'ios', 'web'],
    sourceExts: ['js', 'json', 'ts', 'tsx'],
  },
};
