/* @flow */

type HeaderObj = {
  label: string,
  value: string,
}

export default function mapHeaders(headers: Array<string>): Array<HeaderObj> {
  return headers.map((header: string): HeaderObj => {
    if (header === '_published' || header === 'publish')
      return {
        label: '_published',
        value: 'publish',
      }
    if (header === '_hasStagedChanges' || header === 'hasStagedChanges')
      return {
        label: '_hasStagedChanges',
        value: 'hasStagedChanges',
      }
    if (header === 'variantId' || header === 'variant.id')
      return {
        label: 'variantId',
        value: 'variant.id',
      }
    if (header === 'variantKey' || header === 'variant.key')
      return {
        label: 'variantKey',
        value: 'variant.key',
      }
    if (header === 'sku' || header === 'variant.sku')
      return {
        label: 'sku',
        value: 'variant.sku',
      }
    if (header === 'tax' || header === 'taxCategory')
      return {
        label: 'tax',
        value: 'taxCategory',
      }
    if (header === 'images' || header === 'variant.images')
      return {
        label: 'images',
        value: 'variant.images',
      }
    return {
      label: header,
      value: header,
    }
  })
}
