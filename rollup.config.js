/* eslint-disable */
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const filesize = require('rollup-plugin-filesize');
/* eslint-enable */

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const config = {
  sourcemap: true,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    json(),
    resolve({
      module: true,
      preferBuiltins: true,
    }),
    commonjs(),
    filesize(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = config;
