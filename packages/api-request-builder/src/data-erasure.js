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
 * @return {Object} The instance of the service, can be chained.
 */

export default function withFullDataErasure(): Object {
  this.params.dataErasure = 'dataErasure=true'
  return this
}
