import { MethodType, VariableMap } from 'shared/utils/common-types'

export interface CommonRequest {
  baseURL: string
  url?: string
  headers?: VariableMap
  method: MethodType
  uriTemplate: string
  pathVariables?: VariableMap
  queryParams?: VariableMap
  body?: any
}
