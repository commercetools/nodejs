const CONSTANTS = {
  host: {
    api: 'https://api.europe-west1.gcp.commercetools.com',
    auth:
      'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
  },

  field: {
    integer: new RegExp(/^-?\d+$/),
    money: new RegExp(/^([A-Z]{3}) (-?\d+)$/),
  },

  header: {
    sku: 'variant-sku',
  },

  standardOption: {
    batchSize: 100,
    delimiter: ',',
    defaultLogFile: 'csvparserprice.log',
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach(key => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
