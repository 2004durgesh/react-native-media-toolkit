const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const root = path.resolve(__dirname, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {() => Promise<import('metro-config').MetroConfig>}
 */
module.exports = async () => {
  const { withMetroConfig } = await import('react-native-monorepo-config');
  
  const config = withMetroConfig(getDefaultConfig(__dirname), {
    root,
    dirname: __dirname,
  });

  config.resolver.unstable_enablePackageExports = true;
  // // Force React and React Native to resolve from root
  // config.resolver.extraNodeModules = {
  // ...(config.resolver.extraNodeModules || {}),
  // react: path.resolve(__dirname, 'node_modules/react'),
  // 'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  // 'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
// };

  return wrapWithReanimatedMetroConfig(config);
};
