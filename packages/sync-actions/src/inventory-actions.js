import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions';

export const baseActionsList = [
  { action: 'changeQuantity', key: 'quantityOnStock', actionKey: 'quantity' },
  { action: 'setRestockableInDays', key: 'restockableInDays' },
  { action: 'setExpectedDelivery', key: 'expectedDelivery' },
];

export const referenceActionsList = [
  { action: 'setSupplyChannel', key: 'supplyChannel' },
];

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  });
}

export function actionsMapReferences(diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  });
}
