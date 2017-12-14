/* @flow */

import { normalize } from 'normalizr'
import { productEntity } from './schemas'

export default (response: Object): Object =>
  normalize(response, { results: [productEntity] })
