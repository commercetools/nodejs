import forEach from 'lodash.foreach'

import { buildBaseAttributesActions } from './utils/common-actions'
import * as diffPatcher from './utils/diffpatcher'
import extractMatchingPairs from './utils/extract-matching-pairs'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)
const getIsChangedOperation = key => REGEX_NUMBER.test(key)
const getIsRemovedOperation = key => REGEX_UNDERSCORE_NUMBER.test(key)

export const baseActionsList = [
  { action: 'changeKey', key: 'key' },
  { action: 'changeName', key: 'name' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

export function actionsMapFieldDefinitions(
  fieldDefinitionsDiff,
  previous,
  next,
  diffPaths
) {
  const actions = []
  forEach(fieldDefinitionsDiff, (diffValue, diffKey) => {
    const extractedPairs = extractMatchingPairs(
      diffPaths,
      diffKey,
      previous,
      next
    )

    if (getIsChangedOperation(diffKey)) {
      if (Array.isArray(diffValue)) {
        const deltaValue = diffPatcher.getDeltaValue(diffValue)
        if (deltaValue.name) {
          actions.push({
            action: 'addFieldDefinition',
            fieldDefinition: deltaValue,
          })
        }
      } else if (diffValue.label) {
        actions.push({
          action: 'changeLabel',
          label: extractedPairs.newObj.label,
          fieldName: extractedPairs.oldObj.name,
        })
      }
    } else if (getIsRemovedOperation(diffKey)) {
      if (Array.isArray(diffValue)) {
        if (diffValue.length === 3 && diffValue[2] === 3) {
          actions.push({
            action: 'changeFieldDefinitionOrder',
            fieldNames: next,
          })
        } else {
          const deltaValue = diffPatcher.getDeltaValue(diffValue)
          if (deltaValue === undefined && diffValue[0].name)
            actions.push({
              action: 'removeFieldDefinition',
              fieldName: diffValue[0].name,
            })
        }
      }
    }
  })
  return actions
}
