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
  Attribute,
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
      (variant: SingleVarPerProduct): MappedProduct =>
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
    const mappedVariant: Object = _.reduce(
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
        return undefined
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
    let priceString: string = ''

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

  _mapLtextAttribute(name: string, value: Object): Object {
    // create an object with value based on selected language
    const mappedAttribute = {
      [name]: value[this.lang],
    }
    // create object with translations indexed with keys like: attributeName.en
    const labels = flatten({
      [name]: value, // value contains object with localized labels
    })

    // add labels in format "attribName.en: labelEnValue" to all attributes
    return _.merge(mappedAttribute, labels)
  }

  _mapLabelsToAllAttributes(name: string, labels: Array<Object>): Object {
    const mappedValues: Object = {}
    const languages: Array<string> = _(labels)
      .map(Object.keys)
      .flatten()
      .uniq()
      .value()

    languages.forEach(lang => {
      const headerKey: string = `${name}.${lang}`
      const values = []

      labels.forEach(label => {
        values.push(label[lang] || '')
      })

      mappedValues[headerKey] = values.join(this.multiValDel)
    })

    return mappedValues
  }

  _mapSetAttribute(name: string, values: Array<any>) {
    const [firstValue] = values
    let mappedValue: string = ''

    // empty set
    if (values.length === 0) mappedValue = ''

    // string, boolean, number
    if (!_.isObject(firstValue)) mappedValue = values.join(this.multiValDel)
    else if (firstValue.id && firstValue.typeId)
      // reference
      mappedValue = values
        .map(value => ProductMapping._mapReference(value))
        .join(this.multiValDel)
    else if (firstValue.key && !_.isObject(firstValue.label))
      // enum
      mappedValue = _.map(values, 'key').join(this.multiValDel)
    else if (firstValue.key && _.isObject(firstValue.label)) {
      // lenum
      const labels = _.map(values, 'label')
      // map all language labels
      const mappedValues = this._mapLabelsToAllAttributes(name, labels)
      // add lenum keys as a main attribute value
      mappedValues[name] = _.map(values, 'key').join(this.multiValDel)
      return mappedValues
    } else {
      // ltext
      const mappedValues = this._mapLabelsToAllAttributes(name, values)
      // copy value from selected language as a main attribute value
      mappedValues[name] = mappedValues[`${name}.${this.lang}`]
      return mappedValues
    }

    return {
      [name]: mappedValue,
    }
  }

  /**
   * Method will take an attribute and map it to string
   * @param attribute Attribute which should be mapped
   * @param allAttributes Result object with all attributes
   * @returns {*} Mapped attribute
   * @private
   */
  _mapAttribute(attribute: Attribute): Object {
    const { name, value } = attribute
    let mappedAttribute: Object = {}

    if (_.isObject(value) && !_.isArray(value)) {
      // ltext, enum, lenum
      if (value.id && value.typeId)
        // reference
        mappedAttribute[name] = ProductMapping._mapReference(value)
      else if (value.key && !_.isUndefined(value.label))
        // ENUM or LENUM attribute
        mappedAttribute = ProductMapping._mapLenumOrEnumAttribute(name, value)
      else
        // LTEXT attribute
        mappedAttribute = this._mapLtextAttribute(name, value)
    } else if (_.isArray(value)) {
      // SET attribute
      mappedAttribute = this._mapSetAttribute(name, value)
    } else
      // PLAIN attribute: boolean, string, number
      mappedAttribute[name] = value

    return mappedAttribute
  }

  _mapAttributes(attributes: any): Object {
    return _.reduce(
      attributes,
      (mappedAttributes: Object, attribute: Object): Object =>
        _.merge(mappedAttributes, this._mapAttribute(attribute)),
      {}
    )
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
    return _.reduce(
      product,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapProductProperty(value, property, product)
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

  static _mapLenumOrEnumAttribute(name: string, value: Object) {
    const mappedAttribute = {
      [name]: value.key,
    }

    // if it is lenum (has label), add all languages to mappedAttribute object
    if (value.label && _.isObject(value.label)) {
      const labels = {
        [name]: value.label,
      }

      // add labels in format "attribName.en: labelEnValue" to all attributes
      _.merge(mappedAttribute, flatten(labels))
    }

    return mappedAttribute
  }

  static _mapReference(value: Object): string {
    return _.get(value, 'obj.key') || _.get(value, 'obj.name') || value.id
  }
}
