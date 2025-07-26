//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  ...tanstackConfig,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  reactHooks.configs['recommended-latest'],
  {
    rules: {
      'no-shadow': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      'import/no-duplicates': 'off',
      'import/consistent-type-specifier-style': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
  },
]
