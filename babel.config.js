module.exports = {
  presets: ['module:react-native-builder-bob/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/constants': './src/constants',
          '@/components': './src/components',
          '@/hooks': './src/hooks',
          '@/store': './src/store',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/skins': './src/skins',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};
