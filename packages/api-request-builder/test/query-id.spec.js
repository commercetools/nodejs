import * as queryId from '../src/query-id'

describe('queryId', () => {
  let service

  beforeEach(() => {
    service = { params: {}, ...queryId }
  })

  test('should set the id param', () => {
    service.byId('123')
    expect(service.params.id).toBe('123')
  })

  test('should throw if id is missing', () => {
    expect(() => service.byId()).toThrow(
      /Required argument for `byId` is missing/
    )
  })

  test('should set the key param', () => {
    service.byKey('bar')
    expect(service.params.key).toBe('bar')
  })

  test('should throw if key is missing', () => {
    expect(() => service.byKey()).toThrow(
      /Required argument for `byKey` is missing/
    )
  })

  test('should set the customerId param', () => {
    service.byCustomerId('myCustomer')
    expect(service.params.customerId).toBe('myCustomer')
  })

  test('should set the orderNumber param', () => {
    service.byOrderNumber(123)
    expect(service.params.orderNumber).toBe(123)
  })

  test('should throw if customerId is missing', () => {
    expect(() => service.byCustomerId()).toThrow(
      /Required argument for `byCustomerId` is missing/
    )
  })

  test('should throw if orderNumber is missing', () => {
    expect(() => service.byOrderNumber()).toThrow(
      /Required argument for `byOrderNumber` is missing or invalid/
    )
  })

  test('should throw if orderNumber is invalid', () => {
    expect(() => service.byOrderNumber('hi')).toThrow(
      /Required argument for `byCustomerId` is missing/
    )
  })

  test('should set the cartId param', () => {
    service.byCartId('myCart')
    expect(service.params.cartId).toBe('myCart')
  })

  test('should throw if cartId is missing', () => {
    expect(() => service.byCartId()).toThrow(
      /Required argument for `byCartId` is missing/
    )
  })

  test('throw if byId is used after byKey', () => {
    expect(() => service.byKey('bar').byId('123')).toThrow(
      'A key for this resource has already been set. ' +
        'You cannot use both `byKey` and `byId`.'
    )
  })

  test('throw if byKey is used after byId', () => {
    expect(() => service.byId('123').byKey('bar')).toThrow(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byKey`.'
    )
  })

  test('throw if byCustomerId is used after byId', () => {
    expect(() => service.byId('theId').byCustomerId('theCustId')).toThrow(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )
  })

  test('throw if byId is used after byCustomerId', () => {
    expect(() => service.byCustomerId('foo').byId('789')).toThrow(
      'A customerId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )
  })

  test('throw if byCartId is used after byId', () => {
    expect(() => service.byId('theId').byCartId('theCartId')).toThrow(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )
  })

  test('throw if byId is used after byCartId', () => {
    expect(() => service.byCartId('foo').byId('789')).toThrow(
      'A cartId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )
  })
})
