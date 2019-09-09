module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['import', 'jest', 'prettier', '@typescript-eslint/eslint-plugin'],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/unbound-method': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,

    // Specific for the generated SDK
    'import/no-duplicates': 0,
    'import/no-cycle': 0,
    'spaced-comment': 0
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      'eslint-import-resolver-typescript': true,
      typescript: {},
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
}
