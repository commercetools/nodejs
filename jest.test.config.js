module.exports = {
  displayName: 'test',
  testEnvironment: 'node',
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
  },
  transform: {
    '^.+\\.js$': '<rootDir>/jest.transform.js',
    '^.+\\.ts?$': '<rootDir>/node_modules/babel-jest',
  },
  testRegex: '\\.spec\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/integration-tests/',
    '/packages/.*/node_modules',
    '/packages/.*/dist',
    '/packages/.*/li',
  ],
}
