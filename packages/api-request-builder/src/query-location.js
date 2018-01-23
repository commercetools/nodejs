/* @flow */

/**
 * Set the given `country` param used for selection by country
 *
 * @param  {string} value - A two-digit country code as per ISO 3166-1 alpha-2
 * @return {Object} The instance of the service, can be chained.
 */
export function byCountry(value: string): Object {
  if (!value) throw new Error('Required argument for `byCountry` is missing')

  this.params.location.country = value
  return this
}

/**
 * Set the given `currency` param used for selection by currency.
 *
 * @param  {string} value - The currency code compliant to ISO 4217
 * Can only be used with country parameter
 * @return {Object} The instance of the service, can be chained.
 */
export function byCurrency(value: string): Object {
  if (!value) throw new Error('Required argument for `byCurrency` is missing')

  // logic to verify country has been set
  if (!this.params.location.country)
    throw new Error(
      'A `country` for this resource has not been set. ' +
        'You must set the country in order to use the `byCurrency` method.'
    )

  this.params.location.currency = value
  return this
}

/**
 * Set the given `state` param used for selection by state.
 *
 * @param  {string} value - A string representing State name
 * Can only be used with country parameter
 * @return {Object} The instance of the service, can be chained.
 */
export function byState(value: string): Object {
  if (!value) throw new Error('Required argument for `byState` is missing')

  // logic to verify country has been set
  if (!this.params.location.country)
    throw new Error(
      'A `country` for this resource has not been set. ' +
        'You must set the country in order to use the `byState` method.'
    )

  this.params.location.state = value
  return this
}
