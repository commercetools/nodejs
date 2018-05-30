/* @flow */
/**
 * Set the `dataErasure` option to the internal state of the service instance
 * in order to generate a DELETE uri that guarantees that all personal data related to
 * the particular object, including invisible data, is erased, in compliance with the GDPR.
 *
 * Users are, however, responsible for identifying and deleting all objects that belong to a customer, and deleting them.
 *
 * More info here: https://docs.commercetools.com/release-notes#releases-2018-05-24-data-erasure
 *
 * @param  {boolean} dataErasure - The dataErasure boolean option
 * @throws if `dataErasure` is missing or not a boolean.
 * @return {Object} The instance of the service, can be chained.
 */

export default function fullDataErasure(dataErasure: boolean): Object {
  if (typeof dataErasure !== 'boolean')
    throw new Error('Required argument for `fullDataErasure` is missing')
  this.params.dataErasure = dataErasure
  return this
}
