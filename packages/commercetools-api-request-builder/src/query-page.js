/**
 * Set the sort expression for the query, if the related endpoint supports it.
 * It is possible to specify several `sort` parameters.
 * In this case they are combined into a composed `sort` where the results
 * are first sorted by the first expression, followed by equal values being
 * sorted according to the second expression, and so on.
 *
 * @param  {string} sortPath - The sort path expression.
 * @param  {boolean} [ascending] - Whether the direction should be
 * ascending or not (default: `true`).
 * @throws If `sortPath` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function sort (sortPath, ascending = true) {
  if (!sortPath)
    throw new Error('Required argument for `sort` is missing')

  const direction = ascending ? 'asc' : 'desc'
  const encodedSort = encodeURIComponent(`${sortPath} ${direction}`)
  this.params.pagination.sort.push(encodedSort)
  return this
}

/**
 * Set the page number to be requested from the complete query result
 * (used for pagination as `offset`)
 *
 * @param  {string} value - The page number, greater then zero.
 * @throws If `value` is missing or is a number lesser then one.
 * @return {Object} The instance of the service, can be chained.
 */
export function page (value) {
  if (typeof value !== 'number' && !value)
    throw new Error('Required argument for `page` is missing or invalid')

  if (typeof value !== 'number' ||
    (typeof value === 'number' && value < 1))
    throw new Error('Required argument for `page` must be a number >= 1')

  this.params.pagination.page = value
  return this
}

/**
 * Set the number of results to be returned from a query result
 * (used for pagination as `limit`)
 *
 * @param  {string} value - How many results in a page,
 * greater or equals then zero.
 * @throws If `value` is missing or is a number lesser then zero.
 * @return {Object} The instance of the service, can be chained.
 */
export function perPage (value) {
  if (typeof value !== 'number' && !value)
    throw new Error('Required argument for `perPage` is missing or invalid')

  if (typeof value !== 'number' ||
    (typeof value === 'number' && value < 0))
    throw new Error('Required argument for `perPage` must be a number >= 0')

  this.params.pagination.perPage = value
  return this
}
