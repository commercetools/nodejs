/* @flow */
/**
 * Define whether to get the staged or current projection
 *
 * @param  {boolean} staged - Either `true` (default) or `false`
 * (for current / published)
 * @return {Object} The instance of the service, can be chained.
 */
export function staged (isStaged: boolean = true): Object {
  this.params.staged = isStaged
  return this
}

/**
 * Define whether to set price Selection or not
 * Set the given `priceCurrency` param used for price selection.
 *
 * @param  {string} value - The currency code compliant to ISO 4217
 * @return {Object} The instance of the service, can be chained.
 */
export function priceCurrency (value: string): Object {
  this.params.priceCurrency = value
  return this
}

/**
 * Define whether to set price Selection or not
 * Set the given `priceCountry` param used for price selection.
 *
 * @param  {string} value - A two-digit country code as per ISO 3166-1 alpha-2
 * Can only be used with priceCurrency parameter
 * @return {Object} The instance of the service, can be chained.
 */
export function priceCountry (value: string): Object {
  this.params.priceCountry = value
  return this
}

/**
 * Define whether to set price Selection or not
 * Set the given `priceCustomerGroup` param used for price selection.
 *
 * @param  {string} value - price customer group UUID
 * Can only be used with priceCurrency parameter
 * @return {Object} The instance of the service, can be chained.
 */
export function priceCustomerGroup (value: string): Object {
  this.params.priceCustomerGroup = value
  return this
}

/**
 * Define whether to set price Selection or not
 * Set the given `priceChannel` param used for price selection.
 *
 * @param  {string} value - price channel UUID
 * Can only be used with priceCurrency parameter
 * @return {Object} The instance of the service, can be chained.
 */
export function priceChannel (value: string): Object {
  this.params.priceChannel = value
  return this
}
