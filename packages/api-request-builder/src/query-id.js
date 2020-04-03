/* @flow */
/**
 * Set the given `id` to the internal state of the service instance.
 *
 * @param  {string} id - A resource `UUID`
 * @throws If `id` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byId(id: string): Object {
  if (!id) throw new Error('Required argument for `byId` is missing')
  if (this.params.key)
    throw new Error(
      'A key for this resource has already been set. ' +
        'You cannot use both `byKey` and `byId`.'
    )
  if (this.params.customerId)
    throw new Error(
      'A customerId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )

  if (this.params.cartId)
    throw new Error(
      'A cartId for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )

  this.params.id = id
  return this
}

/**
 * Set the given `key` to the internal state of the service instance.
 *
 * @param  {string} key - A resource `key`
 * @throws If `key` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byKey(key: string): Object {
  if (!key) throw new Error('Required argument for `byKey` is missing')
  if (this.params.id)
    throw new Error(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byKey`.'
    )

  this.params.key = key
  return this
}

/**
 * Set the given `id` to the `customerId`internal state of the service instance.
 * For querying customer carts
 *
 * @param  {string} id - A resource `UUID`
 * @throws If `id` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byCustomerId(custId: string): Object {
  if (!custId)
    throw new Error('Required argument for `byCustomerId` is missing')
  if (this.params.id)
    throw new Error(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCustomerId`.'
    )

  this.params.customerId = custId
  return this
}

/**
 * Set the given `orderNumber` to the `orderNumber` internal state of the service instance.
 * For querying orders
 *
 * @param  {number} orderNumber - An order number
 * @throws If `orderNumber` is missing or invalid
 * @return {Object} The instance of the service, can be chained.
 */
export function byOrderNumber(orderNumber: number): Object {
  if (typeof orderNumber !== 'number')
    throw new Error(
      'Required argument for `byOrderNumber` is missing or invalid'
    )

  this.params.orderNumber = orderNumber
  return this
}

/**
 * Set the given `id` to the `cartId` internal state of the service instance.
 * For querying shipping methods by cart id
 *
 * @param  {string} id - A resource `UUID`
 * @throws If `id` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byCartId(cartId: string): Object {
  if (!cartId) throw new Error('Required argument for `byCartId` is missing')
  if (this.params.id)
    throw new Error(
      'An ID for this resource has already been set. ' +
        'You cannot use both `byId` and `byCartId`.'
    )

  this.params.cartId = cartId
  return this
}

/**
 * Set the given `container` and `key` to the internal state of the service instance.
 *
 * @param  {string} container - A resource `container`
 * @param  {string} key - A resource `key`
 * @throws If `container` or `key` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byContainerAndKey(container: string, key: string): Object {
  if (typeof container !== 'string' || typeof key !== 'string')
    throw new Error(
      'Required `container` or `key` argument for `byContainerAndKey` needs to be a string'
    )

  this.params.container = container
  this.params.key = key
  return this
}
