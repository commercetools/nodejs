/* @flow */
/**
 * Set the
 * [ExpansionPath](http://dev.sphere.io/http-api.html#reference-expansion)
 * used for expanding a
 * [Reference](http://dev.sphere.io/http-api-types.html#reference)
 * of a resource.
 *
 * @param  {string} value - The expand path expression.
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
// eslint-disable-next-line import/prefer-default-export
export function expand(value: string): Object {
  if (!value) throw new Error('Required argument for `expand` is missing');

  const encodedPath = encodeURIComponent(value);
  // Note: this goes to base `params`, not `params.query`
  // to be compatible with search.
  this.params.expand.push(encodedPath);
  return this;
}
