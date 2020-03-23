const CONSTANTS = {
  host: {
    api: 'https://api.europe-west1.gcp.commercetools.com',
    auth:
      'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
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
    encoding: 'utf8',
    strictMode: true,
  },
}

// Go through object because `freeze` works shallow
Object.keys(CONSTANTS).forEach(key => {
  Object.freeze(CONSTANTS[key])
})

export default CONSTANTS
