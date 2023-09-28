// Do this as the first thing so that any code reading it knows the right env.
process.env.BUILD_ROLLUP = true

/* eslint-disable */
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const globals = require('rollup-plugin-node-globals')
const alias = require('@rollup/plugin-alias')
const babelConfig = require('./babel.config')
const node = require('rollup-plugin-node-polyfills')
/* eslint-enable */

const extensions = ['.js', '.jsx', '.ts', '.tsx']
module.exports = {
  input: ['cli.js', 'main.js'],
  output: {
    file: 'dist/cli.js',
    format: 'umd',
    exports: 'auto'
  },
  external: [
    'yargs',
    'pretty-error',
    'pino',
    'fs',
    'csv-parser',
    'highland',
    'JSONStream',
    'lodash.memoize',
    'flat',
    'node-fetch',
    'stream',
    'http',
    'url',
    'http',
    'https',
    'zlib',
    'querystring',
    'dotenv'
  ],
  plugins: [
    json(),
    node(),
    resolve({
      extensions,
      browser: false,
      mainFields: ['module', 'main', 'jsnext'],
      preferBuiltins: true,
      modulesOnly: true,
    }),
    commonjs({
      include: ['node_modules/**'],
      requireReturnsDefault: 'auto',
    }),
    babel({
      exclude: ['node_modules/**'],
      runtimeHelpers: true,
      extensions,
      ...babelConfig,
    })
  ]
};