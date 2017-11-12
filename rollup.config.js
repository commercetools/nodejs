/* eslint-disable */
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const flow = require('rollup-plugin-flow')
const filesize = require('rollup-plugin-filesize')
/* eslint-enable */

const env = process.env.NODE_ENV
const version = process.env.npm_package_version

const config = {
  sourcemap: true,
  plugins: [
    json(),
    flow({ all: true }),
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
      exclude: 'packages/**/src/**',
    }),
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    globals(),
    builtins(),
    filesize(),
  ],
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        warnings: false,
      },
    })
  )
}

module.exports = config
