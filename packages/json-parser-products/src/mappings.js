/* @flow */
import type {
  ResolvedProductProjection,
  ProductWithSingleVariantArray,
  SingleVariantPerProduct,
  MappedProduct,
  Variant,
} from 'types/product'

export default class ProductMapping {
  constructor (fillAllRows: boolean = false, categoryBy: string = 'name') {
    this.fillAllRows = fillAllRows
    this.categoryBy = categoryBy
  }
  run (product: ResolvedProductProjection) {
    const productWithMergedVariants = ProductMapping._mergeVariants(product)
    const variantsWithProductInfo = ProductMapping._spreadProductInfoOnvariants(productWithMergedVariants, this.fillAllRows)
    const a = variantsWithProductInfo.map((variant: SingleVariantPerProduct) => this._mapResolvedTypes(variant))
  }

  static _mergeVariants (product: ResolvedProductProjection): ProductWithSingleVariantArray {
    const variant = [product.masterVariant, ...product.variants]
    const mergedVariants = { ...product, variant }
    delete mergedVariants.masterVariant
    delete mergedVariants.variants
    return mergedVariants
  }

  static _spreadProductInfoOnvariants (product: ProductWithSingleVariantArray, fillAllRows: boolean): Array<SingleVariantPerProduct> {
    if (fillAllRows)
      return product.variant.map(eachVariant: Variant => (
        { ...product, variant: eachVariant }
      ))

    const productWithVariants = product.variant.map(eachVariant: Variant => (
      { variant: eachVariant }
    ))
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  _mapResolvedTypes(variantWithProductInfo: SingleVariantPerProduct): MappedProduct {
    const mappedProduct = Object.assign({}, variantWithProductInfo)
    Object.keys(variantWithProductInfo).forEach((property: string) => {
      switch (property) {
        case 'productType':
          mappedProduct.productType = variantWithProductInfo.productType.name
          break
        case 'state':
          mappedProduct.state = variantWithProductInfo.state.key
          break
        case 'taxCategory':
          mappedProduct.taxCategory = variantWithProductInfo.taxCategory.key || variantWithProductInfo.taxCategory.name
          break
        case 'categories':

      }
    })
  }

  _mapCategoriesToString (categories: Array<*>): string {
    return
  }
}
