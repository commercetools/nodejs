/* @flow */

import { flattenDeep } from 'lodash'

// This method is necessary because of the custom fields, it is not possible
// to know the actual headers on the fly so we would have to prepare the
// headers before we start writing to CSV file
export function _getHeaders (prices: Array<Object>) {
  const headers = new Set()
  prices.forEach((price) => {
    if (price)
      Object.keys(price).forEach(key => headers.add(key))
  })
  return [...headers]
}

export function _flattenPricesArray (productPricesArray: Array<Object>) {
  return flattenDeep(productPricesArray)
}

// Get prices from products
export function _getPrices (product: Object) {
  const masterVariantPricesArray = product.masterVariant.prices
  // Get the price array for the master variant
  const modifiedMVP = masterVariantPricesArray.map(price => (
    { 'variant-sku': product.masterVariant.sku, ...price }
  ))
  // Loop through the variants array
  const variantPrices = product.variants.map((variant) => {
    // Get the price array from each variant in the variant array
    const singleVariantPrice = variant.prices.map(price => (
      { 'variant-sku': variant.sku, ...price }
    ))
    return {
      'variant-sku': variant.sku,
      prices: singleVariantPrice,
    }
  })
  const masterVariantPrices = {
    'variant-sku': product.masterVariant.sku,
    prices: modifiedMVP,
  }
  variantPrices.push(masterVariantPrices)

  return Promise.resolve(variantPrices)
}
