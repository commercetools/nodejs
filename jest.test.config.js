module.exports = {
  displayName: 'test',
  testEnvironment: 'node',
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
    // Without this option, somehow CI fails to run the tests with the following error:
    //   TypeError: Unable to require `.d.ts` file.
    //   This is usually the result of a faulty configuration or import. Make sure there is a `.js`, `.json` or another executable extension available alongside `core.ts`.
    // Fix is based on this comment:
    // - https://github.com/kulshekhar/ts-jest/issues/805#issuecomment-456055213
    // - https://github.com/kulshekhar/ts-jest/blob/master/docs/user/config/isolatedModules.md
    'ts-jest': {
      isolatedModules: true,
    },
  },
  transform: {
    '^.+\\.js$': '<rootDir>/jest.transform.js',
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '\\.spec\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/integration-tests/',
    '/packages/.*/node_modules',
    '/packages/.*/dist',
    '/packages/.*/lib',
  ],
}
