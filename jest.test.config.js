module.exports = {
  displayName: 'test',
  testEnvironment: 'node',
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/integration-tests/',
    '/packages/.*/node_modules',
    '/packages/.*/dist',
    '/packages/.*/li',
  ],
}
