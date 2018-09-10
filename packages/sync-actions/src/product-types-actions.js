import forEach from 'lodash.foreach'
import flatten from 'lodash.flatten'
import isNil from 'lodash.isnil'
import { deepEqual } from 'fast-equals'
import { buildBaseAttributesActions } from './utils/common-actions'
import extractMatchingPairs from './utils/extract-matching-pairs'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const getIsChangedOperation = key => REGEX_NUMBER.test(key)

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
  { action: 'changeDescription', key: 'description' },
]

export function actionsMapBase(diff, previous, next, config = {}) {
  if (!diff) return []
  return buildBaseAttributesActions({
    diff,
    actions: baseActionsList,
    oldObj: previous,
    newObj: next,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

const attributeDefinitionsActionsList = [
  { action: 'changeLabel', key: 'label' },
  { action: 'setInputTip', key: 'inputTip' },
  { actionKey: 'newValue', action: 'changeInputHint', key: 'inputHint' },
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

    if (
      getIsChangedOperation(diffKey) &&
      !Array.isArray(diffValue) &&
      getIsAnAttributeDefinitionBaseFieldChange(diffValue)
    ) {
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
    }
  })
  return actions
}

export const generateBaseFieldsUpdateActions = (
  previous,
  next,
  actionDefinition
) => {
  const isEmpty = value =>
    [isNil, nextValue => nextValue === ''].some(operator =>
      operator(typeof value === 'string' ? value.trim() : value)
    )
  return Object.entries(actionDefinition).reduce(
    (nextUpdateActions, [field, actionFieldDefinition]) => {
      if (isEmpty(previous[field]) && isEmpty(next[field]))
        return nextUpdateActions
      if (!isEmpty(previous[field]) && isEmpty(next[field]))
        return [...nextUpdateActions, actionFieldDefinition]
      if (!deepEqual(previous[field], next[field])) {
        switch (field) {
          case 'key':
            return [
              ...nextUpdateActions,
              {
                action: actionFieldDefinition.action,
                attributeName: actionFieldDefinition.attributeName,
                key: previous[field],
                newKey: next[field],
              },
            ]
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

export const actionsMapForHints = (nestedEntityChanges = {}) => [
  ...generateUpdateActionsForAttributeDefinitions(
    nestedEntityChanges.attributeDefinitions
  ),
  ...generateUpdateActionsForAttributeEnumValues(
    nestedEntityChanges.attributeEnumValues
  ),
]
