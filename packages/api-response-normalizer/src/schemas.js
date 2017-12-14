import { schema } from 'normalizr'

// helpers
const ref = type => ({ obj: type })

const typeEntity = new schema.Entity('types')

const customField = {
  type: ref(typeEntity),
}

const asset = {
  custom: customField,
}

export const categoryEntity = new schema.Entity('categories')
categoryEntity.define({
  ancestors: [ref(categoryEntity)],
  parent: ref(categoryEntity),
  custom: customField,
  assets: [asset],
})

export const customerGroupEntity = new schema.Entity('customerGroups')
export const channelEntity = new schema.Entity('channels', {
  custom: customField,
})
export const productDiscountEntity = new schema.Entity('productDiscounts')

const discountedPrice = {
  discount: ref(productDiscountEntity),
}

const price = {
  customerGroup: ref(customerGroupEntity),
  channel: ref(channelEntity),
  discounted: discountedPrice,
  custom: customField,
}

const scopedPrice = {
  customerGroup: ref(customerGroupEntity),
  channel: ref(channelEntity),
  discounted: discountedPrice,
  custom: customField,
}

const productVariant = {
  prices: [price],
  assets: [asset],
  scopedPrice,
}

const productData = {
  categories: [ref(categoryEntity)],
  masterVariant: productVariant,
  variants: [productVariant],
}

const productCatalogData = {
  current: productData,
  staged: productData,
}

export const productTypeEntity = new schema.Entity('productTypes')

export const stateEntity = new schema.Entity('states')
stateEntity.define({ transitions: [ref(stateEntity)] })

export const taxCategoryEntity = new schema.Entity('taxCategories')

export const productEntity = new schema.Entity('products', {
  productType: ref(productTypeEntity),
  masterData: productCatalogData,
  taxCategory: ref(taxCategoryEntity),
  state: ref(stateEntity),
})
