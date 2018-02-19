import forEach from 'lodash.foreach'
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
  {
    action: 'changeLabel',
    key: 'label',
  },
  {
    action: 'setInputTip',
    key: 'inputTip',
  },
  {
    action: 'changeInputHint',
    key: 'inputHint',
  },
  {
    actionKey: 'newValue',
    action: 'changeAttributeConstraint',
    key: 'attributeConstraint',
  },
  {
    action: 'changeIsSearchable',
    key: 'isSearchable',
  },
]

const getIsAnAttributeDefinitionBaseFieldChange = diff =>
  diff.label ||
  diff.inputHint ||
  diff.inputTip ||
  diff.label ||
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
      }
    } else if (getIsRemovedOperation(diffKey)) {
      const deltaValue = diffpatcher.getDeltaValue(diffValue)
      if (deltaValue === undefined && diffValue[0].name)
        actions.push({
          action: 'removeAttributeDefinition',
          name: diffValue[0].name,
        })
    }
  })
  return actions
}
