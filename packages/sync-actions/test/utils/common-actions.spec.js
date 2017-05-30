import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from '../../src/utils/common-actions'
import * as diffpatcher from '../../src/utils/diffpatcher'

describe('Common actions', () => {
  describe('::buildBaseAttributesActions', () => {
    const testActions = [
      {
        action: 'changeName',
        key: 'name',
      },
      {
        action: 'setDescription',
        key: 'description',
      },
      {
        action: 'setExternalId',
        key: 'externalId',
      },
      {
        action: 'changeSlug',
        key: 'slug',
      },
      {
        action: 'setCustomerNumber',
        key: 'customerNumber',
      },
      {
        action: 'setCustomerNumber',
        key: 'customerNumber',
      },
      {
        action: 'changeQuantity',
        key: 'quantityOnStock',
        actionKey: 'quantity',
      },
    ]

    it('should build base actions', () => {
      const before = {
        name: { en: 'Foo' },
        description: undefined,
        externalId: '123',
        slug: { en: 'foo' },
        customerNumber: undefined,
        quantityOnStock: 1,
      }
      const now = {
        name: { en: 'Foo1', de: 'Foo2' },
        description: { en: 'foo bar' },
        externalId: null,
        slug: { en: 'foo' },
        customerNumber: null,
        quantityOnStock: 0,
      }

      const actions = buildBaseAttributesActions({
        actions: testActions,
        diff: diffpatcher.diff(before, now),
        oldObj: before,
        newObj: now,
      })

      expect(actions).toEqual([
        { action: 'changeName', name: now.name },
        { action: 'setDescription', description: now.description },
        { action: 'setExternalId' },
        { action: 'changeQuantity', quantity: now.quantityOnStock },
      ])
    })
  })

  describe('::buildReferenceActions', () => {
    const testActions = [
      { action: 'setTaxCategory', key: 'taxCategory' },
      { action: 'setCustomerGroup', key: 'customerGroup' },
      { action: 'setSupplyChannel', key: 'supplyChannel' },
      { action: 'setProductType', key: 'productType' },
    ]

    it('should build reference actions', () => {
      const before = {
        taxCategory: { id: 'tc-1', typeId: 'tax-category' },
        customerGroup: undefined,
        supplyChannel: { id: 'sc-1', typeId: 'channel' },
        productType: {
          id: 'pt-1', typeId: 'product-type', obj: { id: 'pt-1' },
        },
      }
      const now = {
        // id changed
        taxCategory: { id: 'tc-2', typeId: 'tax-category' },
        // new ref
        customerGroup: { id: 'cg-1', typeId: 'customer-group' },
        // unset
        supplyChannel: null,
        // ignore update
        productType: {
          id: 'pt-1', typeId: 'product-type',
        },
      }

      const actions = buildReferenceActions({
        actions: testActions,
        diff: diffpatcher.diff(before, now),
        oldObj: before,
        newObj: now,
      })

      expect(actions).toEqual([
        { action: 'setTaxCategory', taxCategory: now.taxCategory },
        { action: 'setCustomerGroup', customerGroup: now.customerGroup },
        { action: 'setSupplyChannel' },
      ])
    })
  })
})
