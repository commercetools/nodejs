import mapHeaders from '../src/map-headers'

describe('mapHeaders', () => {
  describe('maps headers from user', () => {
    let headerFields
    beforeEach(() => {
      headerFields = [
        '_published',
        '_hasStagedChanges',
        'productType',
        'variantId',
        'variantKey',
        'id',
        'key',
        'sku',
        'tax',
        'categories',
        'images',
        'name.en',
        'description.en',
        'slug.en',
        'attribute',
        'customAttribute',
      ]
    })

    test('contains `_published`', () => {
      expect(mapHeaders(headerFields)[0]).toEqual({
        label: '_published',
        value: 'published',
      })
    })

    test('contains `_hasStagedChanges`', () => {
      expect(mapHeaders(headerFields)[1]).toEqual({
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      })
    })

    test('contains `productType`', () => {
      expect(mapHeaders(headerFields)[2]).toEqual({
        label: 'productType',
        value: 'productType',
      })
    })

    test('contains `variantId`', () => {
      expect(mapHeaders(headerFields)[3]).toEqual({
        label: 'variantId',
        value: 'variant.id',
      })
    })

    test('contains `variantKey`', () => {
      expect(mapHeaders(headerFields)[4]).toEqual({
        label: 'variantKey',
        value: 'variant.key',
      })
    })

    test('contains `id`', () => {
      expect(mapHeaders(headerFields)[5]).toEqual({
        label: 'id',
        value: 'id',
      })
    })

    test('contains `key`', () => {
      expect(mapHeaders(headerFields)[6]).toEqual({
        label: 'key',
        value: 'key',
      })
    })

    test('contains `sku`', () => {
      expect(mapHeaders(headerFields)[7]).toEqual({
        label: 'sku',
        value: 'variant.sku',
      })
    })

    test('contains `tax`', () => {
      expect(mapHeaders(headerFields)[8]).toEqual({
        label: 'tax',
        value: 'taxCategory',
      })
    })

    test('contains `categories`', () => {
      expect(mapHeaders(headerFields)[9]).toEqual({
        label: 'categories',
        value: 'categories',
      })
    })

    test('contains `images`', () => {
      expect(mapHeaders(headerFields)[10]).toEqual({
        label: 'images',
        value: 'variant.images',
      })
    })

    test('contains `name.en`', () => {
      expect(mapHeaders(headerFields)[11]).toEqual({
        label: 'name.en',
        value: 'name.en',
      })
    })

    test('contains `description.en`', () => {
      expect(mapHeaders(headerFields)[12]).toEqual({
        label: 'description.en',
        value: 'description.en',
      })
    })

    test('contains `slug.en`', () => {
      expect(mapHeaders(headerFields)[13]).toEqual({
        label: 'slug.en',
        value: 'slug.en',
      })
    })

    test('contains `attribute`', () => {
      expect(mapHeaders(headerFields)[14]).toEqual({
        label: 'attribute',
        value: 'attribute',
      })
    })

    test('contains `customAttribute`', () => {
      expect(mapHeaders(headerFields)[15]).toEqual({
        label: 'customAttribute',
        value: 'customAttribute',
      })
    })
  })

  describe('maps own headers from own attributes', () => {
    let headerFields
    beforeEach(() => {
      headerFields = [
        'published',
        'hasStagedChanges',
        'productType',
        'variant.id',
        'variant.key',
        'id',
        'key',
        'variant.sku',
        'taxCategory',
        'categories',
        'variant.images',
        'name.en',
        'description.en',
        'slug.en',
        'attribute',
        'customAttribute',
      ]
    })

    test('contains `published`', () => {
      expect(mapHeaders(headerFields)[0]).toEqual({
        label: '_published',
        value: 'published',
      })
    })

    test('contains `hasStagedChanges`', () => {
      expect(mapHeaders(headerFields)[1]).toEqual({
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      })
    })

    test('contains `productType`', () => {
      expect(mapHeaders(headerFields)[2]).toEqual({
        label: 'productType',
        value: 'productType',
      })
    })

    test('contains `variant.id`', () => {
      expect(mapHeaders(headerFields)[3]).toEqual({
        label: 'variantId',
        value: 'variant.id',
      })
    })

    test('contains `variant.key`', () => {
      expect(mapHeaders(headerFields)[4]).toEqual({
        label: 'variantKey',
        value: 'variant.key',
      })
    })

    test('contains `id`', () => {
      expect(mapHeaders(headerFields)[5]).toEqual({
        label: 'id',
        value: 'id',
      })
    })

    test('contains `key`', () => {
      expect(mapHeaders(headerFields)[6]).toEqual({
        label: 'key',
        value: 'key',
      })
    })

    test('contains `variant.sku`', () => {
      expect(mapHeaders(headerFields)[7]).toEqual({
        label: 'sku',
        value: 'variant.sku',
      })
    })

    test('contains `taxCategory`', () => {
      expect(mapHeaders(headerFields)[8]).toEqual({
        label: 'tax',
        value: 'taxCategory',
      })
    })

    test('contains `categories`', () => {
      expect(mapHeaders(headerFields)[9]).toEqual({
        label: 'categories',
        value: 'categories',
      })
    })

    test('contains `variant.images`', () => {
      expect(mapHeaders(headerFields)[10]).toEqual({
        label: 'images',
        value: 'variant.images',
      })
    })

    test('contains `name.en`', () => {
      expect(mapHeaders(headerFields)[11]).toEqual({
        label: 'name.en',
        value: 'name.en',
      })
    })

    test('contains `description.en`', () => {
      expect(mapHeaders(headerFields)[12]).toEqual({
        label: 'description.en',
        value: 'description.en',
      })
    })

    test('contains `slug.en`', () => {
      expect(mapHeaders(headerFields)[13]).toEqual({
        label: 'slug.en',
        value: 'slug.en',
      })
    })

    test('contains `attribute`', () => {
      expect(mapHeaders(headerFields)[14]).toEqual({
        label: 'attribute',
        value: 'attribute',
      })
    })

    test('contains `customAttribute`', () => {
      expect(mapHeaders(headerFields)[15]).toEqual({
        label: 'customAttribute',
        value: 'customAttribute',
      })
    })
  })
})
