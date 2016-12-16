import * as features from './features'

export default {
  categories: {
    type: 'categories',
    endpoint: '/categories',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryString,
    ],
  },
  channels: {
    type: 'channels',
    endpoint: '/channels',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryString,
    ],
  },
  customerGroups: {
    type: 'customerGroups',
    endpoint: '/customer-groups',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryString,
    ],
  },
  productProjections: {
    type: 'product-projections',
    endpoint: '/product-projections',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryString,
      features.projection,
    ],
  },
  productProjectionsSearch: {
    type: 'product-projections-search',
    endpoint: '/product-projections/search',
    features: [
      features.search,
      features.queryOne,
      features.queryExpand,
      features.queryString,
      features.projection,
    ],
  },
  products: {
    type: 'products',
    endpoint: '/products',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
      features.queryString,
    ],
  },
  productTypes: {
    type: 'product-types',
    endpoint: '/product-types',
    features: [
      features.query,
      features.queryOne,
      features.queryString,
    ],
  },
  taxCategories: {
    type: 'tax-categories',
    endpoint: '/tax-categories',
    features: [
      features.query,
      features.queryOne,
      features.queryString,
    ],
  },
}
