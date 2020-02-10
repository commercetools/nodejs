import {
  ClientResponse,
  VariableMap,
  executeRequest,
  ClientRequest,
} from 'shared/utils/common-types'
import { stringify } from 'querystring'

export class ApiRequest<O> {
  private request: ClientRequest
  constructor(
    request: ClientRequest,
    private readonly requestExecutor: executeRequest
  ) {
    this.request = {
      ...request,
      uri: buildRelativeUri(request),
    }
  }

  public execute(): Promise<ClientResponse<O>> {
    return this.requestExecutor(this.request)
  }
}

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

function buildRelativeUri(commonRequest: ClientRequest): string {
  const pathMap = commonRequest.pathVariables
  var uri: string = commonRequest.uriTemplate as string

  for (const param in pathMap) {
    uri = uri.replace(`{${param}}`, `${pathMap[param]}`)
  }

  const resQuery = formatQueryString(commonRequest.queryParams || {})
  return `${uri}${resQuery}`
}
