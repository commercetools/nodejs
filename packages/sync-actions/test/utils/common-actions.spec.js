import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from '../../src/utils/common-actions'
import * as diffpatcher from '../../src/utils/diffpatcher'

describe('Common actions', () => {
  describe('::buildBaseAttributesActions', () => {
    let actions
    let before
    let now
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
        action: 'setKey',
        key: 'key',
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

    test('should build base actions', () => {
      before = {
        name: { en: 'Foo' },
        description: undefined,
        externalId: '123',
        slug: { en: 'foo' },
        customerNumber: undefined,
        quantityOnStock: 1,
      }
      now = {
        name: { en: 'Foo1', de: 'Foo2' },
        description: { en: 'foo bar' },
        externalId: null,
        slug: { en: 'foo' },
        customerNumber: null,
        quantityOnStock: 0,
      }

      actions = buildBaseAttributesActions({
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

    describe('with `shouldOmitEmptyString`', () => {
      beforeEach(() => {
        before = { key: undefined }
        now = { key: '' }
        actions = buildBaseAttributesActions({
          actions: testActions,
          diff: diffpatcher.diff(before, now),
          oldObj: before,
          newObj: now,
          shouldOmitEmptyString: true,
        })
      })
      it('should not return `setKey` action', () => {
        expect(actions).toEqual([])
      })
    })

    describe('without `shouldOmitEmptyString`', () => {
      beforeEach(() => {
        before = { key: undefined }
        now = { key: '' }
        actions = buildBaseAttributesActions({
          actions: testActions,
          diff: diffpatcher.diff(before, now),
          oldObj: before,
          newObj: now,
          shouldOmitEmptyString: false,
        })
      })
      it('should not return `setKey` action', () => {
        expect(actions).toEqual([
          {
            action: 'setKey',
            key: '',
          },
        ])
      })
    })
  })

  describe('::buildReferenceActions', () => {
    const testActions = [
      { action: 'setTaxCategory', key: 'taxCategory' },
      { action: 'setCustomerGroup', key: 'customerGroup' },
      { action: 'setSupplyChannel', key: 'supplyChannel' },
      { action: 'setProductType', key: 'productType' },
      { action: 'transitionState', key: 'state' },
      { action: 'setKey', key: 'key' },
    ]

    describe('without expanded references', () => {
      describe('taxCategory', () => {
        let actions
        const before = {
          taxCategory: { id: 'tc-1', typeId: 'tax-category' },
        }
        const now = {
          // id changed
          taxCategory: { id: 'tc-2', typeId: 'tax-category' },
        }

        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should build reference action', () => {
          expect(actions).toContainEqual({
            action: 'setTaxCategory',
            taxCategory: now.taxCategory,
          })
        })
      })

      describe('customerGroup', () => {
        let actions
        const before = {
          customerGroup: undefined,
        }
        const now = {
          // new ref
          customerGroup: { id: 'cg-1', typeId: 'customer-group' },
        }

        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should build reference action', () => {
          expect(actions).toContainEqual({
            action: 'setCustomerGroup',
            customerGroup: now.customerGroup,
          })
        })
      })

      describe('supplyChannel', () => {
        let actions
        const before = {
          supplyChannel: { id: 'sc-1', typeId: 'channel' },
        }
        const now = {
          // unset
          supplyChannel: null,
        }

        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should build reference action', () => {
          expect(actions).toContainEqual({ action: 'setSupplyChannel' })
        })
      })

      describe('productType', () => {
        let actions
        const before = {
          productType: {
            id: 'pt-1',
            typeId: 'product-type',
            obj: { id: 'pt-1' },
          },
        }
        const now = {
          // ignore update
          productType: {
            id: 'pt-1',
            typeId: 'product-type',
          },
        }
        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should not build reference action', () => {
          expect(actions).not.toContainEqual({ action: 'productType' })
        })
      })

      describe('state', () => {
        let actions
        const before = {
          state: {
            id: 's-1',
            typeId: 'state',
            obj: { id: 's-1' },
          },
        }
        const now = {
          // new ref: transition state
          state: {
            id: 's-2',
            typeId: 'state',
          },
        }

        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should build reference action', () => {
          expect(actions).toContainEqual({
            action: 'transitionState',
            state: now.state,
          })
        })
      })
    })

    describe('with expanded references', () => {
      describe('state', () => {
        let actions
        const before = {
          state: {
            id: 's-1',
            typeId: 'state',
            obj: { id: 's-1' },
          },
        }
        const now = {
          // new ref: transition state
          state: {
            id: 's-2',
            typeId: 'state',
            obj: { id: 's-1' },
          },
        }

        beforeEach(() => {
          actions = buildReferenceActions({
            actions: testActions,
            diff: diffpatcher.diff(before, now),
            oldObj: before,
            newObj: now,
          })
        })

        test('should build reference action without expansion in action', () => {
          expect(actions).toContainEqual({
            action: 'transitionState',
            state: {
              typeId: now.state.typeId,
              id: now.state.id,
            },
          })
        })
      })
    })
  })
})
