/* @flow */
import type {
  ResolvedProdProj,
  ProdWithMergedVariants,
  SingleVariantPerProduct,
  MappedProduct,
  Variant,
  Category,
  Image,
} from 'types/product'

import { flatten } from 'flat'
import { isEmpty, reduce, pickBy } from 'lodash'

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
    const variantsWithProductInfo = ProductMapping._spreadProdOnVariants(
      mergedVarProducts, this.fillAllRows)
    const a = variantsWithProductInfo.map((variant: SingleVariantPerProduct) => this._mapProperties(variant))
    const flatProducts = a.map(flatten)
    return flatProducts
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
      return product.variant.map((eachVariant: Variant): Object => (
        { ...product, variant: eachVariant }
      ))

    const productWithVariants: Array<Object> = product.variant.map((
      eachVariant: Variant,
    ): SingleVariantPerProduct => (
      { variant: eachVariant }
    ))
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  _mapProperties (product: SingleVariantPerProduct): MappedProduct {
    return reduce(product, (
      acc: Object,
      value: any,
      property: string,
    ): Object => {
      switch (property) {
        case 'productType': {
          acc[property] = value.name
          break
        }
        case 'state': {
          acc[property] = value.key
          break
        }
        case 'taxCategory': {
          acc[property] = value.key || value.name
          break
        }
        case 'categories': {
          acc[property] = ProductMapping._mapCategories(
            value, this.categoryBy, this.multiValDel, this.lang)
          break
        }
        case 'categoryOrderHints': {
          if (!isEmpty(value))
            acc[property] = Object.keys(value).map((key: string): string => (
              `${key}:${value[key]}`
            )).join(this.multiValDel)
          break
        }
        case 'searchKeywords': {
          // TODO: Handle the searchKeywords
          break
        }
        case 'variant': {
          if (!isEmpty(value.attributes)) {
            acc.attr = {}
            value.attributes.forEach((attr: Object) => {
              acc.attr[attr.name] = attr.value.key || attr.value
            })
          }
          let images
          if (!isEmpty(value.images))
            images = value.images.map((image: Image): string => {
              const { url, dimensions, label } = image
              let imageString = `${url}|${dimensions.w}|${dimensions.h}`
              imageString += label ? `|${label}` : ''
              return imageString
            }).join(';')

          const { id, sku, key } = value
          acc[property] = pickBy({ id, sku, key, images }, Boolean)
          break
        }
        default: {
          if (!isEmpty(property))
            acc[property] = value
        }
      }
      return acc
    }, {})
  }

  static _mapCategories (
    categories: Array<Category>,
    categoryBy: string,
    multiValDel: string,
    lang: string,
  ): string {
    if (categoryBy === 'name') // name is localized
      return categories.map((cat: Category): string => (
        cat[categoryBy][lang])).join(multiValDel)
    else if (categoryBy === 'externalId' || categoryBy === 'key')
      return categories.map((cat: Category): string => (
        cat[categoryBy])).join(multiValDel)
    return categories.map((cat: Category): string => (
      ProductMapping._retrieveNamedPath(cat, lang))).join(multiValDel)
  }

  static _retrieveNamedPath (category: Category, lang: string): string {
    const getParent = (cat: Category): string => {
      if (!cat.parent)
        return cat.name[lang]
      return `${getParent(cat.parent)}>${cat.name[lang]}`
    }
    return getParent(category)
  }
}
