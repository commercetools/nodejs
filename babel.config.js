const isEnv = env => env === process.env.NODE_ENV

const getPresets = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return { targets: { node: 'current' }, modules: 'commonjs' }
    case 'rollup':
      return {
        targets: { browsers: ['last 2 versions'], node: 'current' },
        modules: false,
      }
    case 'production':
      return {
        targets: { browsers: ['last 2 versions'], node: '6' },
        modules: false,
      }
    case 'cli':
      return { targets: { node: '6' }, modules: 'commonjs' }
    default:
      break
  }
  return {}
}

const getPlugins = () => {
  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-object-rest-spread',
  ]
  return isEnv('rollup') || isEnv('production')
    ? ['@babel/plugin-external-helpers', ...plugins]
    : plugins
}

module.exports = {
  presets: [['@babel/preset-env', getPresets()], '@babel/preset-flow'],
  plugins: getPlugins(),
}
