import flatten from 'lodash.flatten'
import type { SyncAction, ActionGroup, SyncActionConfig } from 'types/sdk'
import createMapActionGroup from './utils/create-map-action-group'
import createBuildActions from './utils/create-build-actions'
import * as customerActions from './customer-actions'
import actionsMapCustom from './utils/action-map-custom'
import * as businessUnitActions from './business-units-actions'
import * as diffpatcher from './utils/diffpatcher'

const createCustomerMapActions = (mapActionGroup, syncActionConfig) => {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () =>
        businessUnitActions.actionsMapBase(
          diff,
          oldObj,
          newObj,
          syncActionConfig
        )
      )
    )

    allActions.push(
      mapActionGroup('billingAddressIds', () =>
        customerActions.actionsMapRemoveBillingAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('shippingAddressIds', () =>
        customerActions.actionsMapRemoveShippingAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('addresses', () =>
        customerActions.actionsMapAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('base', () =>
        customerActions.actionsMapSetDefaultBase(
          diff,
          oldObj,
          newObj,
          syncActionConfig
        )
      )
    )

    allActions.push(
      mapActionGroup('billingAddressIds', () =>
        customerActions.actionsMapAddBillingAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('shippingAddressIds', () =>
        customerActions.actionsMapAddShippingAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('associates', () =>
        businessUnitActions.actionsMapAssociates(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('custom', () => actionsMapCustom(diff, newObj, oldObj))
    )

    return flatten(allActions)
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createCustomerMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
