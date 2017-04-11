/* @flow */
/**
 * Set the `version` number to the internal state of the service instance
 * in order to generate a delete uri
 *
 * @param  {number} version - The version of the item
 * @throws if `version` is missing or not a number.
 * @return {Object} The instance of the service, can be chained.
 */

export default function toDelete (version: number): Object {
  if (!version || typeof version !== 'number')
    throw new Error('Required version to delete missing or not valid')
  this.params.version = version
  return this
}
