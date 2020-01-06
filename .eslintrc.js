const path = require('path')

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'plugin:jest/recommended', 'prettier'],
  plugins: ['flowtype', 'jest', 'prettier'],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/require-parameter-type': 1,
    'flowtype/require-return-type': [
      1,
      'always',
      { annotateUndefined: 'never' },
    ],
    'flowtype/semi': 0,
    'flowtype/space-after-type-colon': [1, 'always'],
    'flowtype/space-before-type-colon': [1, 'never'],
    'flowtype/type-id-match': 0,
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/test/**/*.js'],
      },
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'jest/no-try-expect': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'lines-between-class-members': 0,
    'max-classes-per-file': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        ts: 'never',
      },
    ],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
    'import/resolver': {
      [path.resolve('./eslint-import-resolver-local')]: {
        moduleNameMapper: {
          '^types/(.*)': './types/$1',
        },
      },
    },
  },
}
