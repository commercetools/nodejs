import { MethodType, VariableMap } from "./common-types";

export interface CommonRequest<T> {
  baseURL: string;
  url?: string,
  headers?: VariableMap;
  method: MethodType;
  uriTemplate: string;
  pathVariables?: VariableMap;
  queryParams?: VariableMap;
  body?: T
}