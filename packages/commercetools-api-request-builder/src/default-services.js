import * as features from './features'

export default {
  categories: {
    type: 'categories',
    endpoint: '/categories',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
    ],
  },
  channels: {
    type: 'channels',
    endpoint: '/channels',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
    ],
  },
  customerGroups: {
    type: 'customerGroups',
    endpoint: '/customer-groups',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
    ],
  },
  productProjections: {
    type: 'product-projections',
    endpoint: '/product-projections',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
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
    ],
  },
  productTypes: {
    type: 'product-types',
    endpoint: '/product-types',
    features: [
      features.query,
      features.queryOne,
    ],
  },
  taxCategories: {
    type: 'tax-categories',
    endpoint: '/tax-categories',
    features: [
      features.query,
      features.queryOne,
    ],
  },
  types: {
    type: 'types',
    endpoint: '/types',
    features: [
      features.query,
      features.queryOne,
      features.queryExpand,
    ],
  },
}
