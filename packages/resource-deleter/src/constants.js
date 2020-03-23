const CONSTANTS = {
  host: {
    api: 'https://api.europe-west1.gcp.commercetools.com',
    auth:
      'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
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
