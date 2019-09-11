module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'lib'],
  testMatch: ['<rootDir>/**/*.js', '<rootDir>/**/*.ts'],
}
