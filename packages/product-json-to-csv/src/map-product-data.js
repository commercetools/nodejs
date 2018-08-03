/* @flow */
import type {
  ResolvedProductProjection,
  ProdWithMergedVariants,
  SingleVarPerProduct,
  MappedProduct,
  Variant,
  Category,
  Image,
  Price,
  ProductType,
} from 'types/product'

import { flatten } from 'flat'
import _ from 'lodash'

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
      (variant: SingleVarPerProduct) =>
        ProductMapping._postProcessProduct(this._mapProduct(variant))
    )

    return mappedProduct
  }

  static _postProcessProduct(originalProduct: MappedProduct): MappedProduct {
    // move variant prices and attributes to top level
    // variant.prices => prices
    // variant.attributes.productSize => productSize
    const prices: Array<Price> = _.get(
      originalProduct,
      'variant.prices',
      undefined
    )
    const attributes: Object = _.get(originalProduct, 'variant.attributes', {})
    const cleanedProduct = { ...originalProduct, prices, ...attributes }

    delete cleanedProduct.variant.prices
    delete cleanedProduct.variant.attributes

    const product: MappedProduct = flatten(cleanedProduct)

    // remove undefined values
    Object.entries(product).forEach(([key, val]) => {
      if (_.isUndefined(val)) delete product[key]
    })

    return product
  }

  // merge all variants into a `variant` property and remove
  // `masterVariant` and `variants` fields from product
  static _mergeVariants(
    product: ResolvedProductProjection
  ): ProdWithMergedVariants {
    const variant = _([product.masterVariant])
      .concat(product.variants)
      .compact()
      .value()

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

  static _mapSearchKeywords(value: Object) {
    const keywords: any = {}
    Object.keys(value).forEach((language: string) => {
      const standard = []
      const whitespace = []
      value[language].forEach((keyWord: Object) => {
        if (!keyWord.suggestTokenizer) standard.push(keyWord.text)
        else if (keyWord.suggestTokenizer.type === 'whitespace')
          whitespace.push(keyWord.text.replace(/ /g, ' | '))
      })
      keywords[language] = [...standard, ...whitespace].join(';')
    })
    return keywords
  }

  _mapVariantProperties(variant: Variant, productType: ?ProductType): Object {
    const mappedVariant = _.reduce(
      variant,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapVariantProperty(property, value)
        return acc
      },
      {}
    )

    // complete missing attributes
    if (productType && productType.attributes)
      productType.attributes.forEach((attribute: Object) => {
        if (attribute.name && !mappedVariant.attributes[attribute.name])
          mappedVariant.attributes[attribute.name] = ''
      })

    return mappedVariant
  }

  _mapVariantProperty(property: string, value: any): any {
    switch (property) {
      case 'attributes':
        return this._mapAttributes(value)
      case 'prices':
        return this._mapPrices(value)
      case 'images':
        return this._mapImages(value)
      case 'availability':
        return value.availableQuantity
      case 'id':
      case 'sku':
      case 'key':
        return value
      default:
        return null
    }
  }

  _mapPrices(prices: Array<Price>): string {
    return prices
      .map((price: Price) => ProductMapping._mapPrice(price))
      .join(this.multiValDel)
  }

  static _mapPrice(price: Price): string {
    // Full price:
    // 'country-currencyCode centAmount|discounted.centAmount customerGroup.name#channel.key$validFrom~validUntil'
    let priceString = ''

    if (price.country) priceString += `${price.country}-`

    priceString += `${price.value.currencyCode} ${price.value.centAmount}`

    if (price.discounted) priceString += `|${price.discounted.value.centAmount}`

    if (price.customerGroup && price.customerGroup.name)
      priceString += ` ${price.customerGroup.name}`

    if (price.channel && price.channel.key)
      priceString += `#${price.channel.key}`

    if (price.validFrom) priceString += `$${price.validFrom}`

    if (price.validUntil) priceString += `~${price.validUntil}`

    return priceString
  }

  _mapAttributes(attributes: any): Object {
    const mappedAttributes: Object = {}

    attributes.forEach((attribute: Object) => {
      let value = ''

      if (_.isArray(attribute.value))
        value = attribute.value
          .map((attrValue: Object): string => attrValue.key)
          .join(this.multiValDel)
      else value = attribute.value.key || attribute.value

      mappedAttributes[attribute.name] = value
    })

    return mappedAttributes
    // attributeTypeDef = @typesService.id2nameAttributeDefMap[productType.id][attribute.name].type
    //   if attributeTypeDef.name is CONS.ATTRIBUTE_TYPE_LTEXT
    //   row = @_mapLocalizedAttribute attribute, productType, row
    // else if attributeTypeDef.name is CONS.ATTRIBUTE_TYPE_SET and attributeTypeDef.elementType?.name is CONS.ATTRIBUTE_TYPE_LENUM
    //         # we need special treatment for set of lenums
    //     row = @_mapSetOfLenum(attribute, productType, row)
    // else if attributeTypeDef.name is CONS.ATTRIBUTE_TYPE_SET and attributeTypeDef.elementType?.name is CONS.ATTRIBUTE_TYPE_LTEXT
    //   row = @_mapSetOfLtext(attribute, productType, row)
    // else if attributeTypeDef.name is CONS.ATTRIBUTE_TYPE_LENUM  # we need special treatnemt for lenums
    //     row = @_mapLenum(attribute, productType, row)
    // else if @header.has attribute.name
    //   row[@header.toIndex attribute.name] = @_mapAttribute(attribute, attributeTypeDef)
  }

  _mapImages(images: Array<Image>): string {
    return images
      .map((image: Image): string => {
        const { url, label } = image
        return label ? `${url}|${label}` : url
      })
      .join(this.multiValDel)
  }

  _mapProductProperty(
    value: any,
    property: string,
    product: SingleVarPerProduct
  ): any {
    switch (property) {
      case 'productType':
      case 'taxCategory':
        return value.name
      case 'state':
        return value.key
      case 'categories':
        return ProductMapping._mapCategories(
          value,
          this.categoryBy,
          this.multiValDel,
          this.lang
        )
      case 'categoryOrderHints':
        return _.isEmpty(value)
          ? undefined
          : Object.keys(value)
              .map((key: string): string => `${key}:${value[key]}`)
              .join(this.multiValDel)
      case 'searchKeywords':
        return _.isEmpty(value)
          ? undefined
          : ProductMapping._mapSearchKeywords(value)
      case 'version':
        return undefined
      case 'variant':
        return this._mapVariantProperties(value, product.productType)
      default:
        return value
    }
  }

  _mapProduct(product: SingleVarPerProduct): MappedProduct {
    const mappedProduct = _.reduce(
      product,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapProductProperty(value, property, product)
        return acc
      },
      {}
    )

    return mappedProduct
  }

  static _mapCategories(
    categories: Array<Category>,
    categoryBy: string,
    multiValDel: string,
    lang: string
  ): string {
    return categories
      .map((cat: Category): string =>
        ProductMapping._mapCategory(cat, categoryBy, lang)
      )
      .join(multiValDel)
  }

  static _mapCategory(cat: Category, categoryBy: string, lang: string): string {
    switch (categoryBy) {
      case 'name':
        // name is localized
        return cat.name[lang]
      case 'externalId':
      case 'key':
        return cat[categoryBy] || ''
      default:
        return ProductMapping._retrieveNamedPath(cat, lang)
    }
  }

  static _retrieveNamedPath(category: Category, lang: string): string {
    const getParent = (cat: Object): string => {
      if (!cat.parent) return cat.name[lang]
      return `${getParent(cat.parent)}>${cat.name[lang]}`
    }
    return getParent(category)
  }
}
