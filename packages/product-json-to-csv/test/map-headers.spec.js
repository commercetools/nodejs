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

    it('contains `_published`', () => {
      expect(mapHeaders(headerFields)[0]).toEqual({
        label: '_published',
        value: 'published',
      })
    })

    it('contains `_hasStagedChanges`', () => {
      expect(mapHeaders(headerFields)[1]).toEqual({
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      })
    })

    it('contains `productType`', () => {
      expect(mapHeaders(headerFields)[2]).toEqual({
        label: 'productType',
        value: 'productType',
      })
    })

    it('contains `variantId`', () => {
      expect(mapHeaders(headerFields)[3]).toEqual({
        label: 'variantId',
        value: 'variant.id',
      })
    })

    it('contains `variantKey`', () => {
      expect(mapHeaders(headerFields)[4]).toEqual({
        label: 'variantKey',
        value: 'variant.key',
      })
    })

    it('contains `id`', () => {
      expect(mapHeaders(headerFields)[5]).toEqual({
        label: 'id',
        value: 'id',
      })
    })

    it('contains `key`', () => {
      expect(mapHeaders(headerFields)[6]).toEqual({
        label: 'key',
        value: 'key',
      })
    })

    it('contains `sku`', () => {
      expect(mapHeaders(headerFields)[7]).toEqual({
        label: 'sku',
        value: 'variant.sku',
      })
    })

    it('contains `tax`', () => {
      expect(mapHeaders(headerFields)[8]).toEqual({
        label: 'tax',
        value: 'taxCategory',
      })
    })

    it('contains `categories`', () => {
      expect(mapHeaders(headerFields)[9]).toEqual({
        label: 'categories',
        value: 'categories',
      })
    })

    it('contains `images`', () => {
      expect(mapHeaders(headerFields)[10]).toEqual({
        label: 'images',
        value: 'variant.images',
      })
    })

    it('contains `name.en`', () => {
      expect(mapHeaders(headerFields)[11]).toEqual({
        label: 'name.en',
        value: 'name.en',
      })
    })

    it('contains `description.en`', () => {
      expect(mapHeaders(headerFields)[12]).toEqual({
        label: 'description.en',
        value: 'description.en',
      })
    })

    it('contains `slug.en`', () => {
      expect(mapHeaders(headerFields)[13]).toEqual({
        label: 'slug.en',
        value: 'slug.en',
      })
    })

    it('contains `attribute`', () => {
      expect(mapHeaders(headerFields)[14]).toEqual({
        label: 'attribute',
        value: 'attribute',
      })
    })

    it('contains `customAttribute`', () => {
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

    it('contains `published`', () => {
      expect(mapHeaders(headerFields)[0]).toEqual({
        label: '_published',
        value: 'published',
      })
    })

    it('contains `hasStagedChanges`', () => {
      expect(mapHeaders(headerFields)[1]).toEqual({
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      })
    })

    it('contains `productType`', () => {
      expect(mapHeaders(headerFields)[2]).toEqual({
        label: 'productType',
        value: 'productType',
      })
    })

    it('contains `variant.id`', () => {
      expect(mapHeaders(headerFields)[3]).toEqual({
        label: 'variantId',
        value: 'variant.id',
      })
    })

    it('contains `variant.key`', () => {
      expect(mapHeaders(headerFields)[4]).toEqual({
        label: 'variantKey',
        value: 'variant.key',
      })
    })

    it('contains `id`', () => {
      expect(mapHeaders(headerFields)[5]).toEqual({
        label: 'id',
        value: 'id',
      })
    })

    it('contains `key`', () => {
      expect(mapHeaders(headerFields)[6]).toEqual({
        label: 'key',
        value: 'key',
      })
    })

    it('contains `variant.sku`', () => {
      expect(mapHeaders(headerFields)[7]).toEqual({
        label: 'sku',
        value: 'variant.sku',
      })
    })

    it('contains `taxCategory`', () => {
      expect(mapHeaders(headerFields)[8]).toEqual({
        label: 'tax',
        value: 'taxCategory',
      })
    })

    it('contains `categories`', () => {
      expect(mapHeaders(headerFields)[9]).toEqual({
        label: 'categories',
        value: 'categories',
      })
    })

    it('contains `variant.images`', () => {
      expect(mapHeaders(headerFields)[10]).toEqual({
        label: 'images',
        value: 'variant.images',
      })
    })

    it('contains `name.en`', () => {
      expect(mapHeaders(headerFields)[11]).toEqual({
        label: 'name.en',
        value: 'name.en',
      })
    })

    it('contains `description.en`', () => {
      expect(mapHeaders(headerFields)[12]).toEqual({
        label: 'description.en',
        value: 'description.en',
      })
    })

    it('contains `slug.en`', () => {
      expect(mapHeaders(headerFields)[13]).toEqual({
        label: 'slug.en',
        value: 'slug.en',
      })
    })

    it('contains `attribute`', () => {
      expect(mapHeaders(headerFields)[14]).toEqual({
        label: 'attribute',
        value: 'attribute',
      })
    })

    it('contains `customAttribute`', () => {
      expect(mapHeaders(headerFields)[15]).toEqual({
        label: 'customAttribute',
        value: 'customAttribute',
      })
    })
  })
})
