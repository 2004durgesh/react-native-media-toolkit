const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(process.cwd(), '..');

module.exports = function (api) {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['../src'],
            alias: {
              '@': '../src',
            },
          },
        ],
        'react-native-reanimated/plugin',
      ],
    },
    { root, pkg }
  );
};
