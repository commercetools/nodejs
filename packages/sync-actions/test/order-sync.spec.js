import { performance } from 'perf_hooks'
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
              items: [
                { id: 'li-1', qty: 1 },
                { id: 'li-2', qty: 2 },
              ],
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
    test('should build `setDeliveryItems` action', () => {
      const before = {
        shippingInfo: {
          deliveries: [
            {
              id: 'delivery-1',
              items: [
                { id: 'li-1', qty: 1 },
                { id: 'li-2', qty: 2 },
              ],
              parcels: [],
            },
          ],
        },
      }
      const now = {
        shippingInfo: {
          deliveries: [
            {
              id: 'delivery-1',
              items: [{ id: 'li-2', qty: 2 }],
              parcels: [],
            },
          ],
        },
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'setDeliveryItems',
          items: now.shippingInfo.deliveries[0].items,
          deliveryId: now.shippingInfo.deliveries[0].id,
          deliveryKey: undefined,
        },
      ]
      expect(actual).toEqual(expected)
    })
    test('should build multiple `setDeliveryItems` action', () => {
      const before = {
        shippingInfo: {
          deliveries: [
            {
              id: 'delivery-1',
              items: [
                { id: 'li-1', qty: 1 },
                { id: 'li-2', qty: 2 },
              ],
              parcels: [],
            },
            {
              id: 'delivery-2',
              items: [],
              parcels: [],
            },
          ],
        },
      }
      const now = {
        shippingInfo: {
          deliveries: [
            {
              id: 'delivery-1',
              items: [{ id: 'li-2', qty: 2 }],
              parcels: [],
            },
            {
              id: 'delivery-2',
              items: [
                { id: 'li-1', qty: 1 },
                { id: 'li-2', qty: 2 },
              ],
              parcels: [],
            },
          ],
        },
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'setDeliveryItems',
          items: now.shippingInfo.deliveries[0].items,
          deliveryId: now.shippingInfo.deliveries[0].id,
          deliveryKey: undefined,
        },
        {
          action: 'setDeliveryItems',
          items: now.shippingInfo.deliveries[1].items,
          deliveryId: now.shippingInfo.deliveries[1].id,
          deliveryKey: undefined,
        },
      ]
      expect(actual).toEqual(expected)
    })
    describe('performance test', () => {
      it('should be performant for large arrays', () => {
        const before = {
          shippingInfo: {
            deliveries: Array(100)
              .fill(null)
              .map((a, index) => ({
                parcels: [],
                items: Array(50)
                  .fill(null)
                  .map((b, index2) => {
                    return {
                      id: `id-${index}-${index2}`,
                      qty: 1,
                    }
                  }),
              })),
          },
        }
        const now = {
          shippingInfo: {
            deliveries: Array(100)
              .fill(null)
              .map((a, index) => ({
                parcels: [],
                items: Array(50)
                  .fill(null)
                  .map((b, index2) => {
                    return {
                      id: `id-${index}-${index2}`,
                      qty: 2,
                    }
                  }),
              })),
          },
        }

        const start = performance.now()
        orderSync.buildActions(now, before)
        const end = performance.now()

        expect(end - start).toBeLessThan(500)
      })
    })
  })

  describe('parcels', () => {
    test('should add `parcel` action', () => {
      const before = {
        shippingInfo: {
          deliveries: [
            {
              id: 'id-1',
              parcels: [
                {
                  id: 'unique-id-1',
                  measurements: {
                    heightInMillimeter: 20,
                    lengthInMillimeter: 40,
                    widthInMillimeter: 5,
                    weightInGram: 10,
                  },
                  trackingData: {
                    trackingId: 'tracking-id-1',
                  },
                },
              ],
            },
          ],
        },
      }

      const now = {
        shippingInfo: {
          deliveries: [
            {
              id: 'id-1',
              parcels: [
                {
                  id: 'unique-id-1',
                  measurements: {
                    heightInMillimeter: 20,
                    lengthInMillimeter: 40,
                    widthInMillimeter: 5,
                    weightInGram: 10,
                  },
                  trackingData: {
                    trackingId: 'tracking-id-1',
                  },
                },
                {
                  measurements: {
                    heightInMillimeter: 10,
                    lengthInMillimeter: 20,
                    widthInMillimeter: 2,
                    weightInGram: 5,
                  },
                  trackingData: {
                    trackingId: 'tracking-id-2',
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
          action: 'addParcelToDelivery',
          deliveryId: now.shippingInfo.deliveries[0].id,
          measurements: now.shippingInfo.deliveries[0].parcels[1].measurements,
          trackingData: now.shippingInfo.deliveries[0].parcels[1].trackingData,
        },
      ]

      expect(actual).toEqual(expected)
    })

    test('should create remove `parcel` action', () => {
      const before = {
        shippingInfo: {
          deliveries: [
            {
              id: 'id-1',
              parcels: [
                {
                  id: 'unique-id-1',
                  measurements: {
                    heightInMillimeter: 20,
                    lengthInMillimeter: 40,
                    widthInMillimeter: 5,
                    weightInGram: 10,
                  },
                  trackingData: {
                    trackingId: 'tracking-id-1',
                  },
                },
              ],
            },
          ],
        },
      }

      const now = {
        shippingInfo: {
          deliveries: [
            {
              id: 'id-1',
              parcels: [],
            },
          ],
        },
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeParcelFromDelivery',
          parcelId: before.shippingInfo.deliveries[0].parcels[0].id,
        },
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('returnInfo', () => {
    test('should not build `returnInfo` action if items are not set', () => {
      const before = {
        returnInfo: [],
      }

      const now = {
        returnInfo: [
          {
            returnTrackingId: 'tracking-id-1',
            returnDate: '21-04-30T09:21:15.003Z',
          },
        ],
      }

      const actual = orderSync.buildActions(now, before)
      const expected = []
      expect(actual).toEqual(expected)
    })

    test('should add `returnInfo` action', () => {
      const before = {
        returnInfo: [],
      }

      const now = {
        returnInfo: [
          {
            returnTrackingId: 'tracking-id-1',
            items: [
              {
                id: 'test-1',
                type: 'LineItemReturnItem',
                quantity: 1,
                lineItemId: '1',
                shipmentState: 'Advised',
                paymentState: 'Initial',
              },
              {
                id: 'test-2',
                type: 'LineItemReturnItem',
                quantity: 1,
                lineItemId: '1',
                shipmentState: 'Advised',
                paymentState: 'Initial',
              },
            ],
          },
          {
            returnTrackingId: 'tracking-id-2',
            items: [
              {
                id: 'test-3',
                type: 'LineItemReturnItem',
                quantity: 2,
                lineItemId: '2',
                shipmentState: 'Advised',
                paymentState: 'Initial',
              },
            ],
          },
        ],
      }

      const actual = orderSync.buildActions(now, before)
      const expected = [
        {
          action: 'addReturnInfo',
          returnTrackingId: now.returnInfo[0].returnTrackingId,
          items: now.returnInfo[0].items,
        },
        {
          action: 'addReturnInfo',
          returnTrackingId: now.returnInfo[1].returnTrackingId,
          items: now.returnInfo[1].items,
        },
      ]

      expect(actual).toEqual(expected)
    })

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
                // This have changed
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
                // This have changed
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
                // This have changed
                shipmentState: 'backInStock',
                // This have changed
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
    describe('when all items have changed its `paymentState`', () => {
      test('should build `returnInfoPaymentState` action', () => {
        const before = {
          returnInfo: [
            {
              items: [
                {
                  id: 'id1',
                  shipmentState: 'Returned',
                  paymentState: 'Initial',
                },
              ],
            },
            {
              items: [
                {
                  id: 'id2',
                  shipmentState: 'Returned',
                  paymentState: 'Initial',
                },
                {
                  id: 'id3',
                  shipmentState: 'Returned',
                  paymentState: 'Initial',
                },
                {
                  id: 'id4',
                  shipmentState: 'Returned',
                  paymentState: 'Initial',
                },
                {
                  id: 'id5',
                  shipmentState: 'Returned',
                  paymentState: 'Initial',
                },
              ],
              returnDate: '2022-10-24T00:00:00.000Z',
            },
          ],
        }
        const now = {
          returnInfo: [
            {
              items: [
                {
                  id: 'id1',
                  shipmentState: 'Returned',
                  paymentState: 'NotRefunded',
                },
              ],
            },
            {
              items: [
                {
                  id: 'id2',
                  shipmentState: 'Returned',
                  paymentState: 'Refunded',
                },
                {
                  id: 'id3',
                  shipmentState: 'Returned',
                  paymentState: 'Refunded',
                },
                {
                  id: 'id4',
                  shipmentState: 'Returned',
                  paymentState: 'Refunded',
                },
                {
                  id: 'id5',
                  shipmentState: 'Returned',
                  paymentState: 'Refunded',
                },
              ],
              returnDate: '2022-10-24T00:00:00.000Z',
            },
          ],
        }
        const actual = orderSync.buildActions(now, before)
        const expected = [
          {
            action: 'setReturnPaymentState',
            returnItemId: now.returnInfo[0].items[0].id,
            paymentState: now.returnInfo[0].items[0].paymentState,
          },
          {
            action: 'setReturnPaymentState',
            returnItemId: now.returnInfo[1].items[0].id,
            paymentState: now.returnInfo[1].items[0].paymentState,
          },
          {
            action: 'setReturnPaymentState',
            returnItemId: now.returnInfo[1].items[1].id,
            paymentState: now.returnInfo[1].items[1].paymentState,
          },
          {
            action: 'setReturnPaymentState',
            returnItemId: now.returnInfo[1].items[2].id,
            paymentState: now.returnInfo[1].items[2].paymentState,
          },
          {
            action: 'setReturnPaymentState',
            returnItemId: now.returnInfo[1].items[3].id,
            paymentState: now.returnInfo[1].items[3].paymentState,
          },
        ]
        expect(actual).toEqual(expected)
      })
      describe('performance test', () => {
        it('should be performant for large arrays', () => {
          const before = {
            returnInfo: Array(100)
              .fill(null)
              .map((a, index) => ({
                items: Array(50)
                  .fill(null)
                  .map((b, index2) => {
                    return {
                      id: `id-${index}-${index2}`,
                      shipmentState: 'Returned',
                      paymentState: 'Initial',
                    }
                  }),
              })),
          }
          const now = {
            returnInfo: Array(100)
              .fill(null)
              .map((a, index) => ({
                items: Array(50)
                  .fill(null)
                  .map((b, index2) => {
                    return {
                      id: `id-${index}-${index2}`,
                      shipmentState: 'Returned',
                      paymentState: 'Refunded',
                    }
                  }),
              })),
          }

          const start = performance.now()
          orderSync.buildActions(now, before)
          const end = performance.now()

          expect(end - start).toBeLessThan(500)
        })
      })
    })
  })
})

describe('custom fields', () => {
  let orderSync
  beforeEach(() => {
    orderSync = orderSyncFn()
  })
  test('should build `setCustomType` action', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: true,
        },
      },
    }
    const now = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType2',
        },
        fields: {
          customField1: true,
        },
      },
    }
    const actual = orderSync.buildActions(now, before)
    const expected = [{ action: 'setCustomType', ...now.custom }]
    expect(actual).toEqual(expected)
  })
  test('should build `setCustomField` action', () => {
    const before = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: false,
        },
      },
    }
    const now = {
      custom: {
        type: {
          typeId: 'type',
          id: 'customType1',
        },
        fields: {
          customField1: true,
        },
      },
    }
    const actual = orderSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
