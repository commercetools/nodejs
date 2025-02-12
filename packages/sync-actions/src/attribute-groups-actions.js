import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'

const hasAttribute = (attributes, newValue) =>
  attributes.some((attribute) => attribute.key === newValue.key)

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
    shouldUnsetOmittedProperties: config.shouldUnsetOmittedProperties,
  })
}

export function actionsMapAttributes(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('attributes', {
    [ADD_ACTIONS]: (newAttribute) => ({
      action: 'addAttribute',
      attribute: newAttribute,
    }),
    [REMOVE_ACTIONS]: (oldAttribute) => {
      // We only add the action if the attribute is not included in the new object.
      return !hasAttribute(newObj.attributes, oldAttribute)
        ? {
            action: 'removeAttribute',
            attribute: oldAttribute,
          }
        : null
    },
    [CHANGE_ACTIONS]: (oldAttribute, newAttribute) => {
      const result = []
      // We only remove the attribute in case that the oldAttribute is not
      // included in the new object
      if (!hasAttribute(newObj.attributes, oldAttribute))
        result.push({
          action: 'removeAttribute',
          attribute: oldAttribute,
        })

      // We only add the attribute in case that the newAttribute was not
      // included in the old object
      if (!hasAttribute(oldObj.attributes, newAttribute))
        result.push({
          action: 'addAttribute',
          attribute: newAttribute,
        })

      return result
    },
  })

  return handler(diff, oldObj, newObj)
}
