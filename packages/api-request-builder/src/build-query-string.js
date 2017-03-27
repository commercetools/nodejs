/* @flow */
import type {
  ServiceBuilderDefaultParams,
} from 'types/sdk'

/**
 * Build the query string with the given parameters.
 *
 * @param  {Object} params - An object with query / search parameters.
 * @throws If argument is missing.
 * @return {string} The fully encoded query string.
 */
export default function buildQueryString (
  params: ServiceBuilderDefaultParams,
): string {
  if (!params)
    throw new Error('Missing options object to build query string.')

  const { query, pagination, search, expand, staged, searchKeywords } = params
  let queryString = []

  if (typeof staged === 'boolean')
    queryString.push(`staged=${staged.toString()}`)

  if (expand && expand.length)
    queryString = queryString.concat(expand.map(e => `expand=${e}`))

  if (query) {
    const { operator, where } = query
    const whereParams = where.join(encodeURIComponent(` ${operator} `))
    if (whereParams)
      queryString.push(`where=${whereParams}`)
  }

  if (pagination) {
    const { page, perPage, sort } = pagination
    if (perPage)
      queryString.push(`limit=${perPage}`)
    if (page) {
      const limitParam = perPage || 20
      const offsetParam = limitParam * (page - 1)
      queryString.push(`offset=${offsetParam}`)
    }
    if (sort && sort.length)
      queryString = queryString.concat(sort.map(s => `sort=${s}`))
  }

  if (search) {
    const {
      text, fuzzy, facet, filter, filterByQuery, filterByFacets,
    } = search

    if (text)
      queryString.push(`text.${text.lang}=${text.value}`)
    if (fuzzy)
      queryString.push('fuzzy=true')

    facet.forEach(f => queryString.push(`facet=${f}`))
    filter.forEach(f => queryString.push(`filter=${f}`))
    filterByQuery.forEach(f => queryString.push(`filter.query=${f}`))
    filterByFacets.forEach(f => queryString.push(`filter.facets=${f}`))
  }
  if (searchKeywords)
    searchKeywords.forEach(f =>
      queryString.push(`searchKeywords.${f.lang}=${f.value}`),
    )

  return queryString.join('&')
}
