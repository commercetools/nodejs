/* @flow */
/**
 * Set the given `text` param used for full-text search.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * text to search for.
 * @param  {string} lang - An ISO language tag, used for search
 * the given text in localized content.
 * @throws If `value` or `lang` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function text(value: string, lang: string): Object {
  if (!value || !lang)
    throw new Error('Required arguments for `text` are missing')

  this.params.search.text = { lang, value: encodeURIComponent(value) }
  return this
}

/**
 * Define whether to enable the fuzzy search.
 *
 * @return {Object} The instance of the service, can be chained.
 */
export function fuzzy(): Object {
  this.params.search.fuzzy = true
  return this
}

/**
 * Define the level of the fuzzy search
 *
 * @param  {number} value - An integer representing the fuzzy level
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function fuzzyLevel(value: number): Object {
  if (value === undefined || value === null)
    throw new Error('Required argument for `fuzzyLevel` is missing')
  this.params.search.fuzzyLevel = value
  return this
}

/**
 * Define whether to enable markMatchingVariants
 *
 * @return {Object} The instance of the service, can be chained.
 */
export function markMatchingVariants(): Object {
  this.params.search.markMatchingVariants = true
  return this
}

/**
 * Set the given `facet` filter used for calculating statistical counts.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * facet expression.
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function facet(value: string): Object {
  if (!value) throw new Error('Required argument for `facet` is missing')

  const encodedFacet = encodeURIComponent(value)
  this.params.search.facet.push(encodedFacet)
  return this
}

/**
 * Set the given `filter` param used for filtering search results.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * filter expression.
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function filter(value: string): Object {
  if (!value) throw new Error('Required argument for `filter` is missing')

  const encodedFilter = encodeURIComponent(value)
  this.params.search.filter.push(encodedFilter)
  return this
}

/**
 * Set the given `filter.query` param used for filtering search results.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * filter by query expression.
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function filterByQuery(value: string): Object {
  if (!value)
    throw new Error('Required argument for `filterByQuery` is missing')

  const encodedFilter = encodeURIComponent(value)
  this.params.search.filterByQuery.push(encodedFilter)
  return this
}

/**
 * Set the given `filter.facets` param used for filtering search results.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * filter by query expression.
 * @throws If `value` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function filterByFacets(value: string): Object {
  if (!value)
    throw new Error('Required argument for `filterByFacets` is missing')

  const encodedFilter = encodeURIComponent(value)
  this.params.search.filterByFacets.push(encodedFilter)
  return this
}
