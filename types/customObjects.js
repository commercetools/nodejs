/* @flow */

export type CustomObject = {
  id: string,
  createdAt: string,
  lastModifiedAt: string,
  container: string,
  key: string,
  version: number,
  value: number | string | boolean | Array<any> | Object,
}
