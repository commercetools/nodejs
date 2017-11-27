import mapHeaders from '../src/map-headers'

describe('mapHeaders', () => {
  it('maps headers from user', () => {
    const headers = [
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
    const expected = [
      {
        label: '_published',
        value: 'publish',
      },
      {
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      },
      {
        label: 'productType',
        value: 'productType',
      },
      {
        label: 'variantId',
        value: 'variant.id',
      },
      {
        label: 'variantKey',
        value: 'variant.key',
      },
      {
        label: 'id',
        value: 'id',
      },
      {
        label: 'key',
        value: 'key',
      },
      {
        label: 'sku',
        value: 'variant.sku',
      },
      {
        label: 'tax',
        value: 'taxCategory',
      },
      {
        label: 'categories',
        value: 'categories',
      },
      {
        label: 'images',
        value: 'variant.images',
      },
      {
        label: 'name.en',
        value: 'name.en',
      },
      {
        label: 'description.en',
        value: 'description.en',
      },
      {
        label: 'slug.en',
        value: 'slug.en',
      },
      {
        label: 'attribute',
        value: 'attribute',
      },
      {
        label: 'customAttribute',
        value: 'customAttribute',
      },
    ]

    expect(mapHeaders(headers)).toEqual(expected)
  })

  it('maps own headers from own attributes', () => {
    const headers = [
      'publish',
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
    const expected = [
      {
        label: '_published',
        value: 'publish',
      },
      {
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      },
      {
        label: 'productType',
        value: 'productType',
      },
      {
        label: 'variantId',
        value: 'variant.id',
      },
      {
        label: 'variantKey',
        value: 'variant.key',
      },
      {
        label: 'id',
        value: 'id',
      },
      {
        label: 'key',
        value: 'key',
      },
      {
        label: 'sku',
        value: 'variant.sku',
      },
      {
        label: 'tax',
        value: 'taxCategory',
      },
      {
        label: 'categories',
        value: 'categories',
      },
      {
        label: 'images',
        value: 'variant.images',
      },
      {
        label: 'name.en',
        value: 'name.en',
      },
      {
        label: 'description.en',
        value: 'description.en',
      },
      {
        label: 'slug.en',
        value: 'slug.en',
      },
      {
        label: 'attribute',
        value: 'attribute',
      },
      {
        label: 'customAttribute',
        value: 'customAttribute',
      },
    ]

    expect(mapHeaders(headers)).toEqual(expected)
  })
})
