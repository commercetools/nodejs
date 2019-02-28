const CONSTANTS = {
  host: {
    api: 'https://api.sphere.io',
    auth: 'https://auth.sphere.io',
  },

  standardOption: {
    confirm: 'false',
    defaultLogFile: 'resources-deleted-report.log',
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach(key => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
