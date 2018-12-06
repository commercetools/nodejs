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
import { oneLineTrim } from 'common-tags'
import { flatten } from 'flat'
import {
  get,
  isObject,
  reduce,
  isEmpty,
  isUndefined,
  isNil,
  uniq,
  defaults,
} from 'lodash'

export default class ProductMapping {
  // Set flowtype annotations
  fillAllRows: boolean
  onlyMasterVariants: boolean
  createShortcuts: boolean
  categoryBy: 'name' | 'key' | 'externalId' | 'namedPath'
  mainLanguage: string
  languages: Array<string>
  productLevelProperties: Array<string>
  multiValDel: string

  constructor({
    fillAllRows = false,
    onlyMasterVariants = false,
    categoryBy = 'name',
    language = 'en',
    multiValueDelimiter = ';',
    createShortcuts = false,
    languages,
  }: Object = {}) {
    this.fillAllRows = fillAllRows
    this.onlyMasterVariants = onlyMasterVariants
    this.categoryBy = categoryBy
    this.mainLanguage = language
    this.languages = languages || [language]
    this.multiValDel = multiValueDelimiter
    this.createShortcuts = createShortcuts

    this.productLevelProperties = [
      'id',
      'key',
      'version',
      'createdAt',
      'lastModifiedAt',
      'productType',
      'name',
      'description',
      'slug',
      'categories',
      'categoryOrderHints',
      'metaTitle',
      'metaDescription',
      'metaKeywords',
      'searchKeywords',
      'hasStagedChanges',
      'published',
      'masterVariant',
      'variants',
      'taxCategory',
      'state',
      'reviewRatingStatistics',
    ]
  }

  run(product: ResolvedProductProjection): Array<MappedProduct> {
    const mergedVarProduct = this._mergeVariants(product)
    const varWithProductInfo = ProductMapping._spreadProdOnVariants(
      mergedVarProduct,
      this.fillAllRows
    )
    const mappedProduct = varWithProductInfo.map(
      (variant: SingleVarPerProduct): MappedProduct =>
        this._postProcessProduct(this._mapProduct(variant))
    )

    return mappedProduct
  }

  _postProcessProduct(originalProduct: MappedProduct): MappedProduct {
    // move variant prices and attributes to top level
    // variant.prices => prices
    // variant.attributes.productSize => productSize
    const prices: Array<Price> = get(
      originalProduct,
      'variant.prices',
      undefined
    )
    const attributes: Object = get(originalProduct, 'variant.attributes', {})
    const cleanedProduct = { ...originalProduct, prices }

    // merge attributes to a product and prefix conflicting names if necessary
    Object.entries(attributes).forEach(([key, val]) => {
      // if attribute name have a conflict with some product level property, prefix it with
      // "attribute." string - eg. "productType.en" attribute will become "attribute.productType.en"
      const csvHeaderName = this.productLevelProperties.includes(
        key.split('.')[0]
      )
        ? `attribute.${key}`
        : key
      cleanedProduct[csvHeaderName] = val
    })

    delete cleanedProduct.variant.prices
    delete cleanedProduct.variant.attributes

    const product: MappedProduct = flatten(cleanedProduct)

    // remove undefined values
    Object.entries(product).forEach(([key, val]) => {
      if (isUndefined(val)) delete product[key]
    })

    return product
  }

  // Merge all variants into a `variant` property and remove
  // `masterVariant` and `variants` fields from product.
  // Omit variants if we want to serialize only masterVariants
  _mergeVariants(product: ResolvedProductProjection): ProdWithMergedVariants {
    const variant = [product.masterVariant]
    if (!this.onlyMasterVariants) variant.push(...product.variants)
    const { masterVariant, variants, ...restProduct } = product
    return { ...restProduct, variant }
  }

  static _spreadProdOnVariants(
    product: ProdWithMergedVariants,
    fillAllRows: boolean
  ): Array<SingleVarPerProduct> {
    if (fillAllRows)
      return product.variant.map(
        (eachVariant: Variant): Object => ({
          ...product,
          variant: eachVariant,
        })
      )

    const productWithVariants: Array<Object> = product.variant.map(
      (eachVariant: Variant): SingleVarPerProduct => ({
        variant: eachVariant,
      })
    )
    productWithVariants[0] = { ...product, ...productWithVariants[0] }
    return productWithVariants
  }

  static _mapSearchKeywords(value: Object): Object {
    const keywords: Object = {}
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

  static _createDefaultLanguageValues(languages: Array<string>): Object {
    return languages.reduce(
      (res: Object, lang: string) => ({
        ...res,
        [lang]: '',
      }),
      {}
    )
  }

  /**
   * Check if the attribute has required fields for Money format
   * @param value Attribute value
   * @returns {boolean} Is attribute in a Money format?
   * @private
   */
  static _isMoneyAttribute(value: Object): boolean {
    return ['centPrecision', 'highPrecision'].includes(value.type)
  }

  _mapVariantProperties(variant: Variant, productType: ?ProductType): Object {
    const mappedVariant: Object = reduce(
      variant,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapVariantProperty(property, value)
        return acc
      },
      {}
    )

    // complete missing attributes with empty string
    if (productType && productType.attributes)
      productType.attributes.forEach((attribute: Object) => {
        const mappedAttributes = mappedVariant.attributes || {}
        const attrType =
          get(attribute, 'type.elementType.name') || get(attribute, 'type.name')

        // add default value to attribute (but not in case of ltext when createShortcuts is off)
        if (
          isNil(mappedAttributes[attribute.name]) &&
          (this.createShortcuts || attrType !== 'ltext')
        )
          mappedAttributes[attribute.name] = ''

        // add default language values (eg: {attrName.en: '', attrName.de: ''})
        if (['ltext', 'lenum'].includes(attrType))
          defaults(
            mappedVariant.attributes,
            flatten({
              [attribute.name]: ProductMapping._createDefaultLanguageValues(
                this.languages
              ),
            })
          )
      })

    return mappedVariant
  }

  _mapVariantProperty(property: string, value: any): any {
    switch (property) {
      case 'attributes':
        return this._mapAttributes(value)
      case 'prices':
        return this._mapPricesToString(value)
      case 'images':
        return this._mapImagesToString(value)
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

  _mapPricesToString(prices: Array<Price>): string {
    return prices
      .map((price: Price) => ProductMapping._mapPriceToString(price))
      .join(this.multiValDel)
  }

  static _mapPriceToString(price: Price): string {
    // Full price:
    // 'country-currencyCode centAmount|discounted.centAmount customerGroup.name#channel.key$validFrom~validUntil'

    return oneLineTrim`
      ${price.country ? `${price.country}-` : ''}
      ${price.value.currencyCode} ${price.value.centAmount}
      ${price.discounted ? `|${price.discounted.value.centAmount}` : ''}
      ${`${price.customerGroup?.name ?? ''}`}
      ${price.channel && price.channel.key ? `#${price.channel.key}` : ''}
      ${price.validFrom ? `$${price.validFrom}` : ''}
      ${price.validUntil ? `~${price.validUntil}` : ''}
    `
  }

  _mapLtextAttribute(name: string, value: Object): Object {
    const mappedAttribute = {}

    // generate default ltext value with empty strings for all predefined languages
    const defaultValue = ProductMapping._createDefaultLanguageValues(
      this.languages
    )

    // create a ltext shortcut if enabled: eg. copy color[lang] to color
    if (this.createShortcuts) mappedAttribute[name] = value[this.mainLanguage]
    // create object with translations indexed with keys like: attributeName.en
    const labels = flatten({
      [name]: {
        ...defaultValue,
        ...value,
      }, // value contains object with localized labels
    })

    // add labels in format "attribName.en: labelEnValue" to all attributes
    return { ...mappedAttribute, ...labels }
  }

  /**
   * Method will concatenate all objects in array to one single object.
   * Example input and output:
   * [{attrName: 12}, {attrName: 33}] => {attrName: '12,33'}
   * @param setValues Array
   * @returns Object
   * @private
   */
  _joinMappedSetValues(setValues: Array<Object>) {
    // when there is an object property missing in first N objects, we should
    // prepend value from N+1 object with delimiters:
    // [{attrName.en: 'AA'}, {attrName.en: 'BB'},{attrName.de: '12'}]
    // => {attrName.en: 'AA,BB,', attrName.de: ',,12'}
    let emptyDelim: string = ''

    // reduce all mapped values to a single
    return setValues.reduce((res: Object, setValue: Object, ind): Object => {
      if (!ind) return setValue

      // take all keys from already mapped values and new setValues
      uniq([...Object.keys(res), ...Object.keys(setValue)]).forEach(key => {
        // if we haven't set this key yet, prepend the given value with delimiters
        if (isUndefined(res[key])) res[key] = emptyDelim

        // if we have already some values in the res object add a delimiter
        if (res[key] !== '') res[key] += this.multiValDel

        // and append the new setValue or an empty string if it is undefined
        res[key] += isUndefined(setValue[key]) ? '' : setValue[key]
      })

      emptyDelim += this.multiValDel
      return res
    }, {})
  }

  _mapSetAttribute(name: string, values: Array<any>): Object {
    const mappedValues: Array<any> = values.map(value =>
      this._mapAttribute({ name, value })
    )

    return mappedValues.length
      ? this._joinMappedSetValues(mappedValues)
      : {
          [name]: '',
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

    if (isObject(value) && !Array.isArray(value)) {
      // ltext, enum, lenum
      if (value.id && value.typeId)
        // reference by id
        mappedAttribute[name] = ProductMapping._mapReferenceById(value)
      else if (value.key && value.typeId)
        // reference by key
        mappedAttribute[name] = ProductMapping._mapReferenceByKey(value)
      else if (ProductMapping._isMoneyAttribute(value))
        // Money or HighPrecisionMoney
        mappedAttribute[name] = ProductMapping._mapPriceToString({ value })
      else if (value.key && !isUndefined(value.label))
        // ENUM or LENUM attribute
        mappedAttribute = this._mapLenumOrEnumAttribute(name, value)
      // LTEXT attribute
      else mappedAttribute = this._mapLtextAttribute(name, value)
    } else if (Array.isArray(value)) {
      // SET attribute
      mappedAttribute = this._mapSetAttribute(name, value)
    } else if (typeof value === 'boolean') {
      // BOOLEAN attribute
      mappedAttribute[name] = ProductMapping._mapBooleanToString(value)
    }
    // PLAIN attribute: string, number
    else mappedAttribute[name] = value

    return mappedAttribute
  }

  _mapAttributes(attributes: any): Object {
    return reduce(
      attributes,
      (mappedAttributes: Object, attribute: Object): Object => ({
        ...mappedAttributes,
        ...this._mapAttribute(attribute),
      }),
      {}
    )
  }

  _mapImagesToString(images: Array<Image>): string {
    return images
      .map(
        (image: Image): string => {
          const { url, label } = image
          return label ? `${url}|${label}` : url
        }
      )
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
      case 'name':
      case 'slug':
      case 'description':
        return {
          ...ProductMapping._createDefaultLanguageValues(this.languages),
          ...value,
        }
      case 'categories':
        return ProductMapping._mapCategories(
          value,
          this.categoryBy,
          this.multiValDel,
          this.mainLanguage
        )
      case 'categoryOrderHints':
        return isEmpty(value)
          ? undefined
          : Object.keys(value)
              .map((key: string): string => `${key}:${value[key]}`)
              .join(this.multiValDel)
      case 'searchKeywords':
        return isEmpty(value)
          ? undefined
          : ProductMapping._mapSearchKeywords(value)
      case 'version':
        return undefined
      case 'variant':
        return this._mapVariantProperties(value, product.productType)
      default:
        if (typeof value === 'boolean')
          return ProductMapping._mapBooleanToString(value)
        return value
    }
  }

  _mapProduct(product: SingleVarPerProduct): MappedProduct {
    return reduce(
      product,
      (acc: Object, value: any, property: string): Object => {
        acc[property] = this._mapProductProperty(value, property, product)
        return acc
      },
      {}
    )
  }

  _mapLenumOrEnumAttribute(name: string, value: Object): Object {
    const mappedAttribute = {
      [name]: value.key,
    }

    // if it is lenum (has label), add all languages to mappedAttribute object
    if (value.label && isObject(value.label)) {
      const labels = {
        [name]: {
          ...ProductMapping._createDefaultLanguageValues(this.languages),
          ...value.label,
        },
      }

      // add labels in format "attribName.en: labelEnValue" to all attributes
      return { ...mappedAttribute, ...flatten(labels) }
    }

    return mappedAttribute
  }

  static _mapBooleanToString(value: boolean): string {
    return value.toString()
  }

  static _mapCategories(
    categories: Array<Category>,
    categoryBy: string,
    multiValDel: string,
    lang: string
  ): string {
    return categories
      .map(
        (cat: Category): string =>
          ProductMapping._mapCategory(cat, categoryBy, lang)
      )
      .join(multiValDel)
  }

  static _mapCategory(cat: Category, key: string, lang: string): string {
    switch (key) {
      case 'slug':
        // slug is localized
        return cat.slug[lang] || ''
      case 'name':
        // name is localized
        return cat.name[lang] || ''
      case 'externalId':
      case 'key':
        return cat[key] || ''
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

  static _mapReferenceById(value: Object): string {
    return get(value, 'obj.key') || get(value, 'obj.name') || value.id
  }

  static _mapReferenceByKey(value: Object): string {
    return value.key
  }
}
