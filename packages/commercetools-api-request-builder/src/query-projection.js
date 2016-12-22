/* @flow */
/**
 * Define whether to get the staged or current projection
 *
 * @param  {boolean} staged - Either `true` (default) or `false`
 * (for current / published)
 * @return {Object} The instance of the service, can be chained.
 */
// eslint-disable-next-line import/prefer-default-export
export function staged (isStaged: boolean = true): Object {
  this.params.staged = isStaged
  return this
}
