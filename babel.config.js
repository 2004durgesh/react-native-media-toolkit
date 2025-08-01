module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@': './src',
            },
          },
        ],
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-worklets/plugin',
      ],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
};
