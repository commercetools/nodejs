const getPresets = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        targets: { node: 'current' },
        useBuiltIns: 'usage',
        modules: 'commonjs',
      }
    case 'rollup':
      return {
        targets: {
          browsers: ['last 2 versions'],
          node: 'current',
        },
        useBuiltIns: 'usage',
        modules: false,
      }
    case 'production':
      return {
        targets: {
          browsers: ['last 2 versions'],
          node: '8',
        },
        useBuiltIns: 'usage',
        modules: false,
      }
    case 'cli':
      return {
        targets: { node: '8' },
        useBuiltIns: 'usage',
        modules: 'commonjs',
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
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-optional-chaining',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  overrides: [
    {
      test: ['./src/**/*.ts'],
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', getPresets()],
      ],
    },
  ],
}
