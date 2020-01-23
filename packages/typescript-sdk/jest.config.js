const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  roots: ['./test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(./test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // collectCoverage: true,
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['./defaultTimeout.js'],
}
