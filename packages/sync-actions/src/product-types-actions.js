import forEach from 'lodash.foreach'
import flatten from 'lodash.flatten'
import { deepEqual } from 'fast-equals'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import { buildBaseAttributesActions } from './utils/common-actions'
import * as diffpatcher from './utils/diffpatcher'
import extractMatchingPairs from './utils/extract-matching-pairs'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)
const getIsChangedOperation = key => REGEX_NUMBER.test(key)
const getIsRemovedOperation = key => REGEX_UNDERSCORE_NUMBER.test(key)

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase(diff, previous, next) {
  return buildBaseAttributesActions({
    diff,
    actions: baseActionsList,
    oldObj: previous,
    newObj: next,
  })
}

const attributeDefinitionsActionsList = [
  { action: 'changeLabel', key: 'label' },
  { action: 'setInputTip', key: 'inputTip' },
  { action: 'changeInputHint', key: 'inputHint' },
  { action: 'changeIsSearchable', key: 'isSearchable' },
  {
    actionKey: 'newValue',
    action: 'changeAttributeConstraint',
    key: 'attributeConstraint',
  },
]

const getIsAnAttributeDefinitionBaseFieldChange = diff =>
  diff.label ||
  diff.inputHint ||
  diff.inputTip ||
  diff.attributeConstraint ||
  diff.isSearchable

function actionsMapEnums(attributeType, attributeDiff, previous, next) {
  const getAddActionName = type =>
    type === 'enum' ? 'addPlainEnumValue' : 'addLocalizedEnumValue'
  const getChangeEnumOrderActionName = type =>
    type === 'enum'
      ? 'changePlainEnumValueOrder'
      : 'changeLocalizedEnumValueOrder'
  const getChangeEnumLabelActionName = type =>
    type === 'enum'
      ? 'changePlainEnumValueLabel'
      : 'changeLocalizedEnumValueLabel'

  const handler = createBuildArrayActions('values', {
    [ADD_ACTIONS]: newEnum => ({
      attributeName: next.name,
      action: getAddActionName(attributeType),
      value: newEnum,
    }),
    [CHANGE_ACTIONS]: (oldEnum, newEnum) => {
      const oldEnumInNext = next.values.find(
        nextEnum => nextEnum.key === oldEnum.key
      )
      const changeActions = []
      if (oldEnumInNext) {
        if (!deepEqual(oldEnum.label, oldEnumInNext.label)) {
          changeActions.push({
            attributeName: next.name,
            action: getChangeEnumLabelActionName(attributeType),
            newValue: newEnum,
          })
        } else {
          changeActions.push({
            attributeName: next.name,
            action: getChangeEnumOrderActionName(attributeType),
            value: newEnum,
          })
        }
      } else {
        changeActions.push({
          attributeName: next.name,
          action: 'removeEnumValue',
          value: oldEnum,
        })
        changeActions.push({
          attributeName: next.name,
          action: getAddActionName(attributeType),
          value: newEnum,
        })
      }
      return changeActions
    },
    [REMOVE_ACTIONS]: deletedEnum => ({
      attributeName: next.name,
      action: 'removeEnumValue',
      value: deletedEnum,
    }),
  })
  const actions = []
  const removedKeys = []
  const newEnumValuesOrder = []
  flatten(handler(attributeDiff, previous, next)).forEach(action => {
    if (action.action === 'removeEnumValue') removedKeys.push(action.value.key)
    else if (action.action === getChangeEnumOrderActionName(attributeType)) {
      newEnumValuesOrder.push(action.value)
    } else actions.push(action)
  })
  return [
    ...actions,
    ...(newEnumValuesOrder.length > 0
      ? [
          {
            attributeName: next.name,
            action: getChangeEnumOrderActionName(attributeType),
            values: newEnumValuesOrder,
          },
        ]
      : []),
    ...(removedKeys.length > 0
      ? [
          {
            attributeName: next.name,
            action: 'removeEnumValues',
            keys: removedKeys,
          },
        ]
      : []),
  ]
}

export function actionsMapAttributes(
  attributesDiff,
  previous,
  next,
  diffPaths
) {
  const actions = []
  forEach(attributesDiff, (diffValue, diffKey) => {
    const extractedPairs = extractMatchingPairs(
      diffPaths,
      diffKey,
      previous,
      next
    )
    if (getIsChangedOperation(diffKey)) {
      if (Array.isArray(diffValue)) {
        const deltaValue = diffpatcher.getDeltaValue(diffValue)
        if (deltaValue.name) {
          actions.push({
            action: 'addAttributeDefinition',
            attribute: deltaValue,
          })
        }
      } else if (getIsAnAttributeDefinitionBaseFieldChange(diffValue)) {
        actions.push(
          ...buildBaseAttributesActions({
            actions: attributeDefinitionsActionsList,
            diff: diffValue,
            oldObj: extractedPairs.oldObj,
            newObj: extractedPairs.newObj,
          }).map(action => ({
            ...action,
            attributeName: extractedPairs.oldObj.name,
          }))
        )
      } else if (diffValue.values) {
        actions.push(
          ...actionsMapEnums(
            extractedPairs.oldObj.type.name,
            diffValue,
            extractedPairs.oldObj,
            extractedPairs.newObj
          )
        )
      }
    } else if (getIsRemovedOperation(diffKey)) {
      if (Array.isArray(diffValue)) {
        if (diffValue.length === 3 && diffValue[2] === 3) {
          actions.push({
            action: 'changeAttributeOrder',
            attributes: next,
          })
        } else {
          const deltaValue = diffpatcher.getDeltaValue(diffValue)
          if (deltaValue === undefined && diffValue[0].name)
            actions.push({
              action: 'removeAttributeDefinition',
              name: diffValue[0].name,
            })
        }
      }
    }
  })
  return actions
}
