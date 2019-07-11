const getPresets = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        targets: { node: 'current' },
        modules: 'commonjs',
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
          node: '8',
        },
        modules: false,
      }
    case 'cli':
      return {
        targets: { node: '8' },
        modules: 'commonjs',
      }
    default:
      return {}
  }
}

module.exports = {
  presets: [['@babel/preset-env', getPresets()], '@babel/typescript'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  include: ['src/**/*'],
}
