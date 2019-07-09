import { MethodType } from "./common-types";

export type Variable =  { [key: string]: string | number | boolean }

export interface CommonRequest<T> {
  baseURL: string;
  url?: string,
  headers?: { [key: string]: string };
  method: MethodType;
  uriTemplate: string;
  pathVariables?: Variable;
  queryParams?: Variable;
  body?: T
}