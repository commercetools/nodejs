import { normalize } from 'normalizr'
import * as schemas from './schemas'

export * as schemas from './schemas'
export { denormalize } from 'normalizr'

const createResponseNormalizer = schema => (response: Object): Object => {
  // avoid normalizing error messages
  if (response.statusCode) return response

  return Array.isArray(response.results)
    ? normalize(response, { results: [schema] })
    : normalize(response, schema)
}

export const normalizeCartDiscountsResponse = createResponseNormalizer(
  schemas.cartDiscountEntity
)

export const normalizeCustomersResponse = createResponseNormalizer(
  schemas.customerEntity
)

export const normalizeProductDiscountsResponse = createResponseNormalizer(
  schemas.productDiscountEntity
)

export const normalizeProductTypesResponse = createResponseNormalizer(
  schemas.productTypeEntity
)

export const normalizeProductsResponse = createResponseNormalizer(
  schemas.productEntity
)
