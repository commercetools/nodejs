/* @flow */
/**
 * Restrict results to omit all fields but "id".
 *
 * @return {Object} The instance of the service, can be chained.
 */
// eslint-disable-next-line import/prefer-default-export
export function onlyIds (): Object {
  this.params.onlyIds = true
  return this
}
