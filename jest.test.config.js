module.exports = {
  displayName: 'test',
  testEnvironment: 'node',
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
  },
  transform: {
    '.*': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/integration-tests/',
    '/packages/.*/node_modules',
    '/packages/.*/dist',
    '/packages/.*/li',
  ],
}
