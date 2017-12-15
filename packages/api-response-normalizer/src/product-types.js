/* @flow */

import { normalize } from 'normalizr'
import { productTypeEntity } from './schemas'

export default (response: Object): Object =>
  normalize(response, { results: [productTypeEntity] })
