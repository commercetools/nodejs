const CONSTANTS = {
  host: {
    api: 'https://api.sphere.io',
    auth: 'https://auth.sphere.io',
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
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach((key) => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
