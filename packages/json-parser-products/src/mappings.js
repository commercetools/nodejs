/* @flow */
import type {
  ResolvedProdProj,
  ProdWithMergedVariants,
  SingleVariantPerProduct,
  MappedProduct,
  Variant,
  Category,
} from 'types/product'

import { isEmpty, assignWith } from 'lodash'

export default class ProductMapping {
  // Set flowtype annotations
  fillAllRows: boolean;
  categoryBy: 'name' | 'key' | 'externalId' | 'namedPath';
  lang: string;
  multiValDel: string;

  constructor ({
    fillAllRows = false,
    categoryBy = 'name',
    lang = 'en',
    multiValueDelimiter = ';',
  }: Object = {}) {
    this.fillAllRows = fillAllRows
    this.categoryBy = categoryBy
    this.lang = lang
    this.multiValDel = multiValueDelimiter
  }

  run (product: ResolvedProdProj) {
    const mergedVarProducts = ProductMapping._mergeVariants(product)
    const variantsWithProductInfo = ProductMapping._spreadProdOnVariants(mergedVarProducts, this.fillAllRows)
    const a = variantsWithProductInfo.map((variant: SingleVariantPerProduct) => this._mapProperties(variant))
  }

  static _mergeVariants (product: ResolvedProdProj): ProdWithMergedVariants {
    const variant = [product.masterVariant, ...product.variants]
    const mergedVariants = { ...product, variant }
    delete mergedVariants.masterVariant
    delete mergedVariants.variants
    return mergedVariants
  }

  static _spreadProdOnVariants (
    product: ProdWithMergedVariants,
    fillAllRows: boolean,
  ): Array<SingleVariantPerProduct> {
    if (fillAllRows)
      return product.variant.map((eachVariant: Variant) => {
        const newProduct: Object = { ...product, variant: eachVariant }
        return newProduct
      })

    const productWithVariants: Array<Object> = product.variant.map((
      eachVariant: Variant,
    ): SingleVariantPerProduct => (
      { variant: eachVariant }
    ))
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  _mapProperties (product: SingleVariantPerProduct): MappedProduct {
    return assignWith({}, product, (
      objVal: Object,
      value: any,
      property: string,
      originalProduct: Object,
    ) => {
      switch (property) {
        case 'productType':
          return value.name
        case 'state':
          return value.key
        case 'taxCategory':
          return value.key || value.name
        case 'categories':
          return ProductMapping
            ._mapCategories(value, this.categoryBy, this.multiValDel, this.lang)
        case 'categoryOrderHints':
          if (!isEmpty(value))
            return Object.keys(value).map((key: string) => (
              `${key}:${value[key]}`
            )).join(this.multiValDel)
          return ''
        case 'variant':
          if (!isEmpty(value.attributes)) {
            /* eslint-disable no-param-reassign */
            originalProduct.attr = {}
            value.attributes.forEach((attr) => {
              originalProduct.attr[attr.name] = attr.value.key || attr.value
            })
          }
          delete value.attributes
          /* eslint-enable no-param-reassign */
          return value
        default:
          return value
      }
    })
  }

  static _mapCategories (
    categories: Array<Category>,
    categoryBy: string,
    multiValDel: string,
    lang: string,
  ): string {
    if (categoryBy === 'name') // name is localized
      return categories.map(cat => (
        cat[categoryBy][lang])).join(multiValDel)
    else if (categoryBy === 'externalId' || categoryBy === 'key')
      return categories.map(cat => cat[categoryBy]).join(multiValDel)
    return categories.map(cat => (
      ProductMapping._retrieveNamedPath(cat, lang))).join(multiValDel)
  }

  static _retrieveNamedPath (category, lang) {
    // console.log(category);
    const getParent = (cat) => {
      if (!cat.parent)
        return cat.name[lang]
      return `${getParent(cat.parent)}>${cat.name[lang]}`
    }
    return getParent(category)
  }
}
