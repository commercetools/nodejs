import * as features from '../src/features'
import { setDefaultParams } from '../src/default-params'

describe('defaultParams', () => {
  it('should set default params for a normal endpoint', () => {
    const serviceFeatures = [ features.query, features.queryOne ]
    const params = {}
    setDefaultParams.call({ features: serviceFeatures, params })
    expect(params).toEqual({
      id: null,
      expand: [],
      pagination: {
        page: null,
        perPage: null,
        sort: [],
      },
      query: {
        operator: 'and',
        where: [],
      },
    })
  })

  it('should set default params for product-projections', () => {
    const serviceFeatures = [
      features.query, features.queryOne, features.projection,
    ]
    const params = {}
    setDefaultParams.call({ features: serviceFeatures, params })
    expect(params).toEqual({
      id: null,
      expand: [],
      staged: true,
      pagination: {
        page: null,
        perPage: null,
        sort: [],
      },
      query: {
        operator: 'and',
        where: [],
      },
    })
  })

  it('should set default params for product-projections-search', () => {
    const serviceFeatures = [ features.search, features.projection ]
    const params = {}
    setDefaultParams.call({ features: serviceFeatures, params })
    expect(params).toEqual({
      expand: [],
      staged: true,
      pagination: {
        page: null,
        perPage: null,
        sort: [],
      },
      search: {
        facet: [],
        filter: [],
        filterByQuery: [],
        filterByFacets: [],
        fuzzy: false,
        text: null,
      },
    })
  })
})
