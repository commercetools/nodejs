/* @flow */
/**
 * `Apply an OrderEdit` to an `order` by providing a correct Order Edit ID
 *
 * More info here: https://docs.commercetools.com/http-api-projects-order-edits#apply-an-orderedit
 *
 * @param {string} orderEditId - The ID of the Order Edit.
 *
 * @return {Object} The instance of the service, can be chained.
 */

export default function applyOrderEditTo(orderEditId: string): Object {
  if (typeof orderEditId !== 'string')
    throw new Error('A resource orderEditId is missing or invalid')
  this.params.applyOrderEditTo = orderEditId
  return this
}
