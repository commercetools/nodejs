/* @flow */
/**
 * Set the `version` number to the internal state of the service instance
 * in order to generate a uri with the resource version (for example; to
 * perform a `DELETE` request)
 *
 * @param  {number} version - The version of the resource
 * @throws if `version` is missing or not a number.
 * @return {Object} The instance of the service, can be chained.
 */

export default function withVersion (version: number): Object {
  if (typeof version !== 'number')
    throw new Error('A resource version is missing or invalid')
  this.params.version = version
  return this
}
