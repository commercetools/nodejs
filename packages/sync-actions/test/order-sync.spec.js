import orderSyncFn, { actionGroups } from '../src/orders'
import { baseActionsList } from '../src/order-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'deliveries'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeOrderState', key: 'orderState' },
      { action: 'changePaymentState', key: 'paymentState' },
      { action: 'changeShipmentState', key: 'shipmentState' },
    ])
  })
})

describe('Actions', () => {
  let orderSync
  beforeEach(() => {
    orderSync = orderSyncFn()
  })

  describe('base', () => {
    test('should build *state actions', () => {
      const before = {
        orderState: 'Open',
        paymentState: 'Pending',
        shipmentState: 'Ready',
      }
      const now = {
        orderState: 'Complete',
        paymentState: 'Paid',
        shipmentState: 'Shipped',
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        { action: 'changeOrderState', orderState: 'Complete' },
        { action: 'changePaymentState', paymentState: 'Paid' },
        { action: 'changeShipmentState', shipmentState: 'Shipped' },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('deliveries', () => {
    test('should build `addDelivery` action', () => {
      const before = {
        shippingInfo: {
          deliveries: [],
        },
      }
      const now = {
        shippingInfo: {
          deliveries: [
            {
              items: [{ id: 'li-1', qty: 1 }, { id: 'li-2', qty: 2 }],
              parcels: [
                {
                  measurements: {
                    heightInMillimeter: 1,
                    lengthInMillimeter: 1,
                    widthInMillimeter: 1,
                    weightInGram: 1,
                  },
                  trackingData: {
                    trackingId: '111',
                  },
                },
              ],
            },
          ],
        },
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'addDelivery',
          items: now.shippingInfo.deliveries[0].items,
          parcels: now.shippingInfo.deliveries[0].parcels,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('returnInfo', () => {
    test('should build `setReturnShipmentState` action', () => {
      const before = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const now = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'backInStock',
                paymentState: 'initial',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'setReturnShipmentState',
          returnItemId: now.returnInfo[0].items[0].id,
          shipmentState: now.returnInfo[0].items[0].shipmentState,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setReturnPaymentState` action', () => {
      const before = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const now = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'refunded',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'setReturnPaymentState',
          returnItemId: now.returnInfo[0].items[1].id,
          paymentState: now.returnInfo[0].items[1].paymentState,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setReturnShipmentState` and `setReturnPaymentState` action', () => {
      const before = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const now = {
        returnInfo: [
          {
            returnTrackingId: 'touched-item',
            items: [
              {
                id: 'test-1',
                shipmentState: 'backInStock',
                paymentState: 'refunded',
              },
              {
                id: 'test-2',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
          {
            returnTrackingId: 'not-touched-item',
            items: [
              {
                id: 'test-3',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
              {
                id: 'test-4',
                shipmentState: 'returned',
                paymentState: 'initial',
              },
            ],
          },
        ],
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'setReturnShipmentState',
          returnItemId: now.returnInfo[0].items[0].id,
          shipmentState: now.returnInfo[0].items[0].shipmentState,
        },
        {
          action: 'setReturnPaymentState',
          returnItemId: now.returnInfo[0].items[0].id,
          paymentState: now.returnInfo[0].items[0].paymentState,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
