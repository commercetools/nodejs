/* @flow */
/**
 * Set the given `id` to the internal state of the service instance.
 *
 * @param  {string} id - A resource `UUID`
 * @throws If `id` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function byId (id: string): Object {
  if (!id)
    throw new Error('Required argument for `byId` is missing')
  if (this.params.key)
    throw new Error(
      'A key for this resource has already been set. ' +
      'You cannot use both `byKey` and `byId`.',
    )
  if (this.params.customerId)
    throw new Error(
      'A customerId for this resource has already been set. ' +
      'You cannot use both `byId` and `byCustomerId`.',
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
export function byKey (key: string): Object {
  if (!key)
    throw new Error('Required argument for `byKey` is missing')
  if (this.params.id)
    throw new Error(
      'An ID for this resource has already been set. ' +
      'You cannot use both `byId` and `byKey`.',
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
export function byCustomerId (custId: string): Object {
  if (!custId)
    throw new Error('Required argument for `byCustomerId` is missing')
  if (this.params.id)
    throw new Error(
      'An ID for this resource has already been set. ' +
      'You cannot use both `byId` and `byCustomerId`.',
    )

  this.params.customerId = custId
  return this
}
