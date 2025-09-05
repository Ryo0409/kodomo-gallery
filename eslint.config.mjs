import { defineConfig } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  // ベース設定
  expoConfig,

  // Ignore 設定
  {
    ignores: ['dist/*'],
  },

  // Import plugin 設定 (expoConfigで定義済み、一部ルールを上書き)
  {
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },

  // Prettier 設定
  {
    name: 'prettier/config',
    ...eslintConfigPrettier,
  },
])
