import flatten from 'lodash.flatten'
import { deepEqual } from 'fast-equals'
import {
  createIsEmptyValue,
  buildBaseAttributesActions,
} from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
  { action: 'changeDescription', key: 'description' },
]

export function actionsMapBase(diff, previous, next, config = {}) {
  // when `diff` is undefined, then the underlying `buildActions` has returned any diff
  // which given in product-types would mean that `buildActions` has run with `nestedValuesChanges` applied
  // To allow continuation of update-action generation, we let this pass..
  if (!diff) return []
  return buildBaseAttributesActions({
    diff,
    actions: baseActionsList,
    oldObj: previous,
    newObj: next,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

// this is nearly similar to `buildBaseAttributesActions`, however with a significant difference.
// `buildBasAttributesActions` generates update-actions with help of `diff`,
// which is an object consisting of flags which indicates different operations.
// `generateBaseFieldsUpdateActions` only generate based on `previous` and `next`.
export const generateBaseFieldsUpdateActions = (
  previous,
  next,
  actionDefinition
) => {
  const isEmpty = createIsEmptyValue([undefined, null, ''])
  return Object.entries(actionDefinition).reduce(
    (nextUpdateActions, [field, actionFieldDefinition]) => {
      if (isEmpty(previous[field]) && isEmpty(next[field]))
        return nextUpdateActions
      if (!isEmpty(previous[field]) && isEmpty(next[field]))
        return [...nextUpdateActions, actionFieldDefinition]
      if (!deepEqual(previous[field], next[field])) {
        switch (field) {
          // BEWARE that this is generates update-action only for key of enum attribute value,
          // not key of product type. If we need to re-factor `product-types` sync actions to use
          // `generateBaseFieldsUpdateActions`, we need to extract the following logic so we could
          // cover both entity types.
          case 'key':
            return [
              ...nextUpdateActions,
              // Another option is to have explicit name of `field` e.g `enumKey`, which we could use to
              // generate appropriate update-action for respective entity type.
              // An outline of this on the top of my head:
              // ```js
              // case 'enumKey':
              //   return [
              //     ...nextUpdateActions,
              //     {
              //       action: actionFieldDefinition.action,
              //       attributeName: actionFieldDefinition.attributeName,
              //       key: previous.key,
              //       newKey: next.key,
              //     },
              //   ]
              // case 'productTypeKey':
              //   return [
              //     ...nextUpdateActions,
              //     {
              //       action: actionFieldDefinition.action,
              //       key: next.key
              //     },
              //   ]
              // ```
              {
                action: actionFieldDefinition.action,
                attributeName: actionFieldDefinition.attributeName,
                key: previous[field],
                newKey: next[field],
              },
            ]
          // attribute
          case 'attributeConstraint':
          case 'inputHint':
            return [
              ...nextUpdateActions,
              {
                action: actionFieldDefinition.action,
                attributeName: actionFieldDefinition.attributeName,
                newValue: next[field],
              },
            ]
          default:
            return [
              ...nextUpdateActions,
              {
                action: actionFieldDefinition.action,
                attributeName: actionFieldDefinition.attributeName,
                [field]: next[field],
              },
            ]
        }
      }
      return nextUpdateActions
    },
    []
  )
}

const generateUpdateActionsForAttributeDefinitions = (
  attributeDefinitions = []
) => {
  const removedAttributeDefinitions = attributeDefinitions.filter(
    attributeDefinition =>
      attributeDefinition.previous && !attributeDefinition.next
  )
  const updatedAttributeDefinitions = attributeDefinitions.filter(
    attributeDefinition =>
      attributeDefinition.previous && attributeDefinition.next
  )

  const addedAttributeDefinitions = attributeDefinitions.filter(
    attributeDefinition =>
      !attributeDefinition.previous && attributeDefinition.next
  )

  return [
    ...removedAttributeDefinitions.map(attributeDef => ({
      action: 'removeAttributeDefinition',
      name: attributeDef.previous.name,
    })),
    ...flatten(
      updatedAttributeDefinitions.map(updatedAttributeDefinition =>
        generateBaseFieldsUpdateActions(
          updatedAttributeDefinition.previous,
          updatedAttributeDefinition.next,
          {
            label: {
              action: 'changeLabel',
              attributeName: updatedAttributeDefinition.previous.name,
            },
            inputTip: {
              action: 'setInputTip',
              attributeName: updatedAttributeDefinition.previous.name,
            },
            inputHint: {
              action: 'changeInputHint',
              attributeName: updatedAttributeDefinition.previous.name,
            },
            isSearchable: {
              action: 'changeIsSearchable',
              attributeName: updatedAttributeDefinition.previous.name,
            },
            attributeConstraint: {
              action: 'changeAttributeConstraint',
              attributeName: updatedAttributeDefinition.previous.name,
            },
          }
        )
      )
    ),
    ...addedAttributeDefinitions.map(attributeDef => ({
      action: 'addAttributeDefinition',
      attribute: attributeDef.next,
    })),
  ]
}
const generateUpdateActionsForAttributeEnumValues = (
  attributeEnumValues = []
) => {
  const removedAttributeEnumValues = attributeEnumValues.filter(
    attributeEnumValue =>
      attributeEnumValue.previous && !attributeEnumValue.next
  )
  const updatedAttributeEnumValues = attributeEnumValues.filter(
    attributeEnumValue => attributeEnumValue.next && attributeEnumValue.previous
  )
  const addedAttributeEnumValues = attributeEnumValues.filter(
    attributeEnumValue =>
      !attributeEnumValue.previous && attributeEnumValue.next
  )

  return [
    ...Object.values(
      removedAttributeEnumValues.reduce(
        (nextEnumUpdateActions, removedAttributeEnumValue) => {
          const removedAttributeEnumValueOfSameAttributeName = nextEnumUpdateActions[
            removedAttributeEnumValue.hint.attributeName
          ] || {
            keys: [],
            attributeName: removedAttributeEnumValue.hint.attributeName,
            action: 'removeEnumValues',
          }
          return {
            ...nextEnumUpdateActions,
            [removedAttributeEnumValue.hint.attributeName]: {
              ...removedAttributeEnumValueOfSameAttributeName,
              keys: [
                ...removedAttributeEnumValueOfSameAttributeName.keys,
                removedAttributeEnumValue.previous.key,
              ],
            },
          }
        },
        {}
      )
    ),
    ...flatten(
      updatedAttributeEnumValues.map(updatedAttributeEnumValue => {
        const updateActions = generateBaseFieldsUpdateActions(
          updatedAttributeEnumValue.previous,
          updatedAttributeEnumValue.next,
          {
            key: {
              action: 'changeEnumKey',
              attributeName: updatedAttributeEnumValue.hint.attributeName,
            },
          }
        )
        if (
          !deepEqual(
            updatedAttributeEnumValue.previous.label,
            updatedAttributeEnumValue.next.label
          )
        ) {
          if (updatedAttributeEnumValue.hint.isLocalized) {
            return [
              ...updateActions,
              {
                action: 'changeLocalizedEnumValueLabel',
                attributeName: updatedAttributeEnumValue.hint.attributeName,
                newValue: updatedAttributeEnumValue.next,
              },
            ]
          }
          return [
            ...updateActions,
            {
              action: 'changePlainEnumValueLabel',
              attributeName: updatedAttributeEnumValue.hint.attributeName,
              newValue: updatedAttributeEnumValue.next,
            },
          ]
        }
        return updateActions
      })
    ),
    ...addedAttributeEnumValues.map(addedAttributeEnumValue => ({
      action: addedAttributeEnumValue.hint.isLocalized
        ? 'addLocalizedEnumValue'
        : 'addPlainEnumValue',
      attributeName: addedAttributeEnumValue.hint.attributeName,
      value: addedAttributeEnumValue.next,
    })),
  ]
}

const generateChangeAttributeOrderAction = (
  attrsOld = [],
  attrsNew = [],
  updateActions = []
) => {
  if (!attrsOld.length || !attrsNew.length) return null

  const orderNew = attrsNew.map(attribute => attribute.name)

  const removedAttributeNames = updateActions
    .filter(action => action.action === 'removeAttributeDefinition')
    .map(action => action.name)

  const addedAttributeNames = updateActions
    .filter(action => action.action === 'addAttributeDefinition')
    .map(action => action.attribute.name)

  // changeAttributeOrder action will be sent to CTP API as the last action so we have to
  // calculate how the productType will look like after adding/removing attributes
  const patchedOrderOld = attrsOld
    .map(attribute => attribute.name)
    .filter(name => !removedAttributeNames.includes(name))
    .concat(addedAttributeNames)

  if (orderNew.join(',') !== patchedOrderOld.join(','))
    return {
      action: 'changeAttributeOrderByName',
      attributeNames: orderNew,
    }

  return null
}

export const actionsMapForHints = (nestedValuesChanges = {}, ptOld, ptNew) => {
  const updateActions = [
    ...generateUpdateActionsForAttributeDefinitions(
      nestedValuesChanges.attributeDefinitions
    ),
    ...generateUpdateActionsForAttributeEnumValues(
      nestedValuesChanges.attributeEnumValues
    ),
  ]

  const changeAttributeOrderAction = generateChangeAttributeOrderAction(
    ptOld.attributes,
    ptNew.attributes,
    updateActions
  )

  if (changeAttributeOrderAction) updateActions.push(changeAttributeOrderAction)

  return updateActions
}
