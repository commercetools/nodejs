/* @flow */

import { normalize } from 'normalizr'
import { customerEntity } from './schemas'

export default (response: Object): Object =>
  normalize(response, { results: [customerEntity] })
