import orderSyncFn, { actionGroups } from '../src/orders'
import { baseActionsList } from '../src/order-actions'

describe('Exports', () => {
  it('action group list', () => {
    expect(actionGroups).toEqual(['base', 'deliveries'])
  })

  it('correctly define base actions list', () => {
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

  it('should build *state actions', () => {
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

  it('should build `addDelivery` action', () => {
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
