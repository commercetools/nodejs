/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */

import { stringify } from 'querystring'
import { ClientRequest, VariableMap } from 'shared/utils/common-types'

function isDefined<T>(value: T | undefined | null): value is T {
  return typeof value !== 'undefined' && value !== null
}

function cleanObject<T extends VariableMap>(obj: T): T {
  return Object.keys(obj).reduce<T>((result, key) => {
    const value = obj[key]

    if (Array.isArray(value)) {
      const values = (value as unknown[]).filter(isDefined)
      if (!values.length) {
        return result
      }

      return {
        ...result,
        [key]: values,
      }
    }

    if (isDefined(value)) {
      return { ...result, [key]: value }
    }

    return result
  }, {} as T)
}

function formatQueryString(variableMap: VariableMap) {
  const map = cleanObject(variableMap)
  const result = stringify(map)
  if (result === '') {
    return ''
  }
  return `?${result}`
}

export function buildRelativeUri(commonRequest: ClientRequest): string {
  const pathMap = commonRequest.pathVariables
  var uri: string = commonRequest.uriTemplate as string

  for (const param in pathMap) {
    uri = uri.replace(`{${param}}`, `${pathMap[param]}`)
  }

  const resQuery = formatQueryString(commonRequest.queryParams || {})
  return `${uri}${resQuery}`
}
