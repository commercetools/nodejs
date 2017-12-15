/* @flow */

import { normalize } from 'normalizr'
import { productDiscountEntity } from './schemas'

export default (response: Object): Object =>
  normalize(response, productDiscountEntity)
