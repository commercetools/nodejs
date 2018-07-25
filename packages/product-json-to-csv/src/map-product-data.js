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
import { isEmpty, reduce } from 'lodash'

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
      (variant: SingleVarPerProduct) => this._mapProperties(variant)
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

  _mapSearchKeywords (value: Object) {
    throw new Error("NOT IMPLEMENTED")
    // acc[property] = {}
    // Object.keys(value).forEach(language => {
    //   const standard = []
    //   const whitespace = []
    //   value[language].forEach(keyWord => {
    //     if (!keyWord.suggestTokenizer) standard.push(keyWord.text)
    //     else if (keyWord.suggestTokenizer.type === 'whitespace')
    //       whitespace.push(keyWord.text.replace(/ /g, ' | '))
    //   })
    //   acc[property][language] = [...standard, ...whitespace]
    //     .join(this.multiValDel)
    // })
  }

  _mapVariantProperties(variant: any, product: SingleVarPerProduct): Object {
    const mappedVariant = reduce(
      variant,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapVariantProperty(property, value)
      },
      {}
    )

    // complete missing attributes
    if (product.productType)
      product.productType.attributes.forEach((attribute: Object) => {
        if (!mappedVariant.attributes[attribute.name])
          mappedVariant.attributes[attribute.name] = null
      })

    return mappedVariant
  }

  _mapVariantProperty (value: any, property: string): any {
    if (property === 'attributes')
      return this._mapAttributes(value)

    if (property === 'prices')
          return this._mapPrices(value)

    if (property === 'images')
      return this._mapImages(value)

    if (property === 'availability')
      return value.availableQuantity

    if (['id', 'sku', 'key'].includes(property))
      return value

    return null
  }

  _mapPrices (prices) {
    throw new Error('NOT IMPLEMENTED')
    // return prices.map((price) => {
    //   countryPart = ''
    //   if price.country
    //     countryPart = "#{price.country}-"
    //   customerGroupPart = ''
    //   if price.customerGroup and _.has(@customerGroupService.id2name, price.customerGroup.id)
    //   customerGroupPart = " #{@customerGroupService.id2name[price.customerGroup.id]}"
    //   channelKeyPart = ''
    //   if price.channel and _.has(@channelService.id2key, price.channel.id)
    //   channelKeyPart = "##{@channelService.id2key[price.channel.id]}"
    //   discountedPricePart = ''
    //
    //   validFromPart = ''
    //   if price.validFrom
    //     validFromPart = "$#{price.validFrom}"
    //
    //   validUntilPart = ''
    //   if price.validUntil
    //     validUntilPart = "~#{price.validUntil}"
    //
    //   if price.discounted?
    //     discountedPricePart = "|#{price.discounted.value.centAmount}"
    //     acc + "#{countryPart}#{price.value.currencyCode} #{price.value.centAmount}#{discountedPricePart}#{customerGroupPart}#{channelKeyPart}#{validFromPart}#{validUntilPart}"
    //
    // }, '')
  }

  _mapAttributes (attributes: any): Object {
    const mappedAttributes: Object = {}
    attributes.forEach((attribute: Object) => {

    })

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

  _mapImages (images: Array<Image>): string {
    return images.map((image: Image): string => {
      const { url, label } = image
      return label ? `${url}|${label}` : url
    })
    .join(this.multiValDel)
  }

  _mapProductProperty (value: any, property: string, product: SingleVarPerProduct): any {
    if(['productType', 'taxCategory'].indexOf(property))
      return value.name

    else if (property === 'state')
      return value.key

    else if (property === 'categories')
      return ProductMapping._mapCategories(
        value,
        this.categoryBy,
        this.multiValDel,
        this.lang
      )

    else if (property === 'categoryOrderHints')
      return isEmpty(value)
        ? undefined
        : Object.keys(value)
          .map((key: string): string => `${key}:${value[key]}`)
          .join(this.multiValDel)

    else if (property === 'searchKeywords')
        return isEmpty(value)
          ? undefined
          : this._mapSearchKeywords(value)

    else if (property === 'version')
      // Remove version number
      return undefined

    else if (property === 'variant')
      return this._mapVariantProperties(value, product)

    else
      return value
  }

  _mapProperties(product: SingleVarPerProduct): MappedProduct {
    return reduce(
      product,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapProductProperty(property, value, product)
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
    return categories
      .map((cat: Category): string =>
        ProductMapping._mapCategory(cat, categoryBy, lang)
      )
      .join(multiValDel)
  }

  static _mapCategory(
    cat: Category,
    categoryBy: string,
    lang: string
  ): string {
    if (categoryBy === 'name')
      return cat[categoryBy][lang] // name is localized
    else if (['externalId', 'key'].includes(categoryBy))
      return cat[categoryBy]
    return ProductMapping._retrieveNamedPath(cat, lang)
  }

  static _retrieveNamedPath(category: Category, lang: string): string {
    const getParent = (cat: Object): string => {
      if (!cat.parent) return cat.name[lang]
      return `${getParent(cat.parent)}>${cat.name[lang]}`
    }
    return getParent(category)
  }
}
