const CONSTANTS = {
  host: {
    api: 'https://api.europe-west1.gcp.commercetools.com',
    auth: 'https://auth.europe-west1.gcp.commercetools.com',
  },
  standardOption: {
    defaultLogFile: 'inventories-exporter.log',
    defaultLogLevel: 'info',
    delimiter: ',',
    format: 'json',
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach((key) => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
