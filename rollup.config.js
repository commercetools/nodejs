/* eslint-disable */
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const {
  uglify
} = require('rollup-plugin-uglify')
const filesize = require('rollup-plugin-filesize')
const replaceNodeGlobals = require('rollup-plugin-node-globals')
const babelConfig = require('./babel.config')
/* eslint-enable */

const env = process.env.NODE_ENV
const version = process.env.npm_package_version
const forBrowser = process.env.GENERATE_FOR_BROWSER || false
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
  ],
}
if (forBrowser) {
  config.plugins.push(replaceNodeGlobals({}))
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
config.plugins.push(filesize())
module.exports = config
