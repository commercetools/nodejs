/* @flow */
import type {
  DiscountCode,
  CodeDataArray,
  CodeOptions,
} from 'types/discountCodes'

import TokenGenerator from 'tokgen'

/*
 * The discountCodeGenerator function takes 2 arguments {options} and {data}
 * The {options} will specify the semantics and quantity of discount codes
 * Will throw if no quantity `number` is specified
 * Defaults to 11-digit codes if no length `number` is specified
 * Can also specify an optional prefix `string`
 * options = {
 *   quantity: 100,
 *   length: 15,
 *   prefix: CT,
 * }
 *
 * The {data} should have the attributes of the discount codes
 * data = {
 *   name: {
 *    en: 'foo'
 *   },
 *   description: {
 *    en: 'bar'
 *   },
 *   cartDiscounts: [],
 *   cartPredicate: 'some predicate',
 *   isActive: true,
 *   maxApplications: 10,
 *   maxApplicationsPerCustomer: 2,
 *  }
 */
// eslint-disable-next-line max-len
/*  More information about the discount codes can be found here: http://dev.commercetools.com/http-api-projects-discountCodes.html#discountcode
 */

function _prepareCode(code: string, length: number, prefix: string): string {
  if (!prefix.length) return code

  return `${prefix}${code.slice(-(length - prefix.length))}`
}

export default function discountCodeGenerator(
  options: CodeOptions,
  data: DiscountCode
): CodeDataArray {
  if (typeof options !== 'object' || !options.quantity)
    throw new Error('The generator requires valid parameters. See the docs')
  if (typeof data !== 'object')
    throw new Error('The generator requires discount data')
  const { length, prefix, quantity } = { length: 11, prefix: '', ...options }
  const codes = []
  const chars = '0-9a-zA-Z'
  const generator = new TokenGenerator({ chars, length })
  for (let i = 0; i < quantity; i += 1) {
    const codeObject = { ...data }
    codeObject.code = _prepareCode(generator.generate(), length, prefix)
    codes.push(codeObject)
  }
  return codes
}
