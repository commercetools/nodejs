const CONSTANTS = {
  host: {
    api: 'https://api.sphere.io',
    auth: 'https://auth.sphere.io',
  },
  requiredHeaders: {
    lineItemState: [
      'orderNumber',
      'lineItemId',
      'quantity',
      'fromState',
      'toState',
    ],
    returnInfo: [
      'orderNumber',
      'quantity',
      'lineItemId',
      'shipmentState',
      '_returnId',
    ],
    deliveries: [
      'orderNumber',
      'delivery.id',
      '_itemGroupId',
      'item.id',
      'item.quantity',
    ],
  },
  standardOption: {
    defaultLogFile: 'csvparserorder.log',
    defaultLogLevel: 'info',
    batchSize: 100,
    delimiter: ',',
    strictMode: true,
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach((key) => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
