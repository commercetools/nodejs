/* eslint-disable */
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const filesize = require('rollup-plugin-filesize')
const globals = require('rollup-plugin-node-globals')
const babelConfig = require('./babel.config')
/* eslint-enable */

const env = process.env.NODE_ENV
const version = process.env.npm_package_version
const [, format] = process.env.npm_lifecycle_event.split(':')

const config = {
  output: {
    sourcemap: true,
  },
  plugins: [
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
    babel({
      exclude: ['node_modules/**'],
      runtimeHelpers: true,
      ...babelConfig,
    }),
    format === 'umd' && globals(),
    env === 'production' && uglify(),
    filesize(),
  ].filter(Boolean),
}
module.exports = config
