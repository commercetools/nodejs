const babelConfig = require('./babel.config')

// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = require('babel-jest').createTransformer(babelConfig)
