/* @flow */
import type {
  ResolvedProductProjection,
  ProdWithMergedVariants,
  SingleVarPerProduct,
  MappedProduct,
  Variant,
  Category,
  Image,
} from 'types/product'

import { flatten } from 'flat'
import { isEmpty, reduce, pickBy } from 'lodash'

export default class ProductMapping {
  // Set flowtype annotations
  fillAllRows: boolean
  categoryBy: 'name' | 'key' | 'externalId' | 'namedPath'
  lang: string
  multiValDel: string

  constructor({
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

  run(product: ResolvedProductProjection): Array<MappedProduct> {
    const mergedVarProduct = ProductMapping._mergeVariants(product)
    const varWithProductInfo = ProductMapping._spreadProdOnVariants(
      mergedVarProduct,
      this.fillAllRows
    )
    const mappedProduct = varWithProductInfo.map(
      (variant: SingleVarPerProduct): Object => this._mapProperties(variant)
    )
    const flatProducts = mappedProduct.map(flatten)
    return flatProducts
  }

  // merge all variants into a `variant` property and remove
  // `masterVariant` and `variants` fields from product
  static _mergeVariants(
    product: ResolvedProductProjection
  ): ProdWithMergedVariants {
    const variant = [product.masterVariant, ...product.variants]
    const { masterVariant, variants, ...restProduct } = product
    return { ...restProduct, variant }
  }

  static _spreadProdOnVariants(
    product: ProdWithMergedVariants,
    fillAllRows: boolean
  ): Array<SingleVarPerProduct> {
    if (fillAllRows)
      return product.variant.map((eachVariant: Variant): Object => ({
        ...product,
        variant: eachVariant,
      }))

    const productWithVariants: Array<Object> = product.variant.map(
      (eachVariant: Variant): SingleVarPerProduct => ({
        variant: eachVariant,
      })
    )
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  _mapProperties(product: SingleVarPerProduct): MappedProduct {
    return reduce(
      product,
      (acc: Object, value: any, property: string): Object => {
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
            acc[property] = value.name
            break
          }
          case 'categories': {
            acc[property] = ProductMapping._mapCategories(
              value,
              this.categoryBy,
              this.multiValDel,
              this.lang
            )
            break
          }
          case 'categoryOrderHints': {
            if (!isEmpty(value))
              acc[property] = Object.keys(value)
                .map((key: string): string => `${key}:${value[key]}`)
                .join(this.multiValDel)
            break
          }
          case 'searchKeywords': {
            if (!isEmpty(value)) {
              acc[property] = {}
              Object.keys(value).forEach((language: string) => {
                const standard = []
                const whitespace = []
                value[language].forEach((keyWord: Object) => {
                  if (!keyWord.suggestTokenizer) standard.push(keyWord.text)
                  else if (keyWord.suggestTokenizer.type === 'whitespace')
                    whitespace.push(keyWord.text.replace(/ /g, ' | '))
                })
                acc[property][language] = [...standard, ...whitespace].join(';')
              })
            }
            break
          }
          case 'version': {
            // Remove version number
            break
          }
          case 'variant': {
            if (!isEmpty(value.attributes)) {
              value.attributes.forEach((attribute: Object) => {
                acc[attribute.name] = Array.isArray(attribute.value)
                  ? attribute.value
                      .map((attrValue: Object): string => attrValue.key)
                      .join(this.multiValDel)
                  : attribute.value.key || attribute.value
              })

              // check if product is masterVariant
              if (product.productType)
                product.productType.attributes.forEach((attribute: Object) => {
                  if (!acc[attribute.name]) acc[attribute.name] = ''
                })
            }
            let images
            if (!isEmpty(value.images))
              images = value.images
                .map((image: Image): string => {
                  const { url, label } = image
                  return label ? `${url}|${label}` : url
                })
                .join(this.multiValDel)

            const { id, sku, key } = value
            acc[property] = pickBy({ id, sku, key, images }, Boolean)
            break
          }
          default: {
            acc[property] = value
          }
        }
        return acc
      },
      {}
    )
  }

  static _mapCategories(
    categories: Array<Category>,
    categoryBy: string,
    multiValDel: string,
    lang: string
  ): string {
    if (categoryBy === 'name')
      // name is localized
      return categories
        .map((cat: Category): string => cat[categoryBy][lang])
        .join(multiValDel)
    else if (categoryBy === 'externalId' || categoryBy === 'key')
      return categories
        .map((cat: Category): string => cat[categoryBy])
        .join(multiValDel)
    return categories
      .map((cat: Category): string =>
        ProductMapping._retrieveNamedPath(cat, lang)
      )
      .join(multiValDel)
  }

  static _retrieveNamedPath(category: Category, lang: string): string {
    const getParent = (cat: Object): string => {
      if (!cat.parent) return cat.name[lang]
      return `${getParent(cat.parent)}>${cat.name[lang]}`
    }
    return getParent(category)
  }
}
