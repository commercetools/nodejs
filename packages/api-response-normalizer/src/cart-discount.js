/* @flow */

import { normalize } from 'normalizr'
import { cartDiscountEntity } from './schemas'

export default (response: Object): Object =>
  normalize(response, cartDiscountEntity)
