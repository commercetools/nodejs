/* eslint-disable import/no-extraneous-dependencies,strict,no-param-reassign */

// THIS FILE IS COPIED FROM jest
// https://github.com/facebook/jest/blob/master/eslintImportResolver.js

const path = require('path')
const resolve = require('resolve')

const log = require('debug')('eslint-plugin-import:resolver:node')

module.exports.interfaceVersion = 2

const packageFilter = pkg => {
  if (pkg['jsnext:main']) {
    pkg.main = pkg['jsnext:main']
  }
  return pkg
}

const opts = (file, config) =>
  Object.assign(
    {
      // more closely matches Node (#333)
      extensions: ['.js', '.json'],
    },
    config,
    {
      // path.resolve will handle paths relative to CWD
      basedir: path.dirname(path.resolve(file)),
      packageFilter,
    }
  )

const applyModuleNameMapper = (source, config) => {
  Object.keys(config.moduleNameMapper).forEach(regex => {
    const mappedModuleName = config.moduleNameMapper[regex]

    if (source.match(regex)) {
      const matches = source.match(regex)
      if (!matches) {
        source = mappedModuleName
      } else {
        source = mappedModuleName.replace(
          /\$([0-9]+)/g,
          (_, index) => matches[parseInt(index, 10)]
        )
      }
      source = path.resolve(source)
    }
  })

  return source
}

module.exports.resolve = (source, file, config) => {
  log('Resolving:', source, 'from:', file)
  let resolvedPath

  if (resolve.isCore(source)) {
    log('resolved to core')
    return { found: true, path: null }
  }

  source = applyModuleNameMapper(source, config)

  try {
    resolvedPath = resolve.sync(source, opts(file, config))
    log('Resolved to:', resolvedPath)
    return { found: true, path: resolvedPath }
  } catch (err) {
    log('resolve threw error:', err)
    return { found: false }
  }
}
