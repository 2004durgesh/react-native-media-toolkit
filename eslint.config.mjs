import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: [
      // Development Dependencies
      'node_modules/',
      '.expo/',
      '.expo-shared/',
      '.vscode/',
      '.android/',
      '.yarn/',
      'android/**/*',
      'ios/**/*',
      '.ios/',
      '.github/',
      'apps/**/*',
      'apps/**/*',

      // Build and Output
      'lib/',
      'dist/',
      'build/',
      'web-build/',
      '*.jsbundle',
      '*.bundle',

      // Testing and Coverage
      '__tests__/',
      'test/',
      'jest.setup.*',
      'coverage/',
      'jest.config.*',

      // Configuration Files
      '*.config.*',
      'metro.config.js',
      'babel.config.js',
      'tscconfig.json',
      'app.json',
      'expo-env.d.ts',
      '.env*',

      // Documentation and Info
      'README.md',
      '*.md',

      // Media and Assets
      'assets/',
      '*.svg',
      '*.png',
      '*.jpg',
      '*.jpeg',
      '*.gif',
      '*.ico',

      // Cache and System Files
      '.cache/',
      '*.log',
      '.DS_Store',
      'temp/',
      '*.tmp',

      // Package Management
      'package.json',
      'package-lock.json',
      'yarn.lock',

      // Auto-generated
      '*.generated.*',
      '*.auto.*',
      '*.d.ts',

      // IDE specific
      '.idea/',
      '*.sublime-*',
      '*.swp',
    ],
  },
]);
