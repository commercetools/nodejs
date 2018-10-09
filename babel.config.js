const getPresets = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        targets: { node: 'current' },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        include: ['es7.object.entries'],
      }
    case 'rollup':
      return {
        targets: {
          browsers: ['last 2 versions'],
          node: 'current',
        },
        modules: false,
      }
    case 'production':
      return {
        targets: {
          browsers: ['last 2 versions'],
          node: '6',
        },
        modules: false,
        useBuiltIns: 'usage',
        include: ['es7.object.entries'],
      }
    case 'cli':
      return {
        targets: { node: '6' },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        include: ['es7.object.entries'],
      }
    default:
      return {}
  }
}

module.exports = {
  presets: [['@babel/preset-env', getPresets()], '@babel/preset-flow'],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-optional-chaining',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}
