import * as features from '../src/features'
import { setDefaultParams } from '../src/default-params'

describe('defaultParams', () => {
  test('should set default params for a normal endpoint', () => {
    const serviceFeatures = [features.query, features.queryOne]
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

  test('should set default params for product-projections', () => {
    const serviceFeatures = [
      features.query,
      features.queryOne,
      features.projection,
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

  test('should set default params for product-projections-suggest', () => {
    const serviceFeatures = [
      features.query,
      features.queryOne,
      features.projection,
      features.suggest,
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
      searchKeywords: [],
    })
  })

  test('should set default params for product-projections-search', () => {
    const serviceFeatures = [features.search, features.projection]
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
        fuzzyLevel: 0,
        markMatchingVariants: false,
        text: null,
      },
    })
  })

  describe('shipping methods', () => {
    const serviceFeatures = [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryLocation,
    ]
    const params = {}
    setDefaultParams.call({ features: serviceFeatures, params })

    test('should set a default location object', () => {
      expect(params.location).toBeDefined()
    })

    test('should set country in locations', () => {
      expect(params.location.country).toEqual('')
    })

    test('should set currency in locations', () => {
      expect(params.location.currency).toEqual('')
    })

    test('should set state in locations', () => {
      expect(params.location.state).toEqual('')
    })
  })
})
