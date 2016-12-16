/**
 * Set the given `id` to the internal state of the service instance.
 *
 * @param  {string} id - A resource `UUID`
 * @throws If `id` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
// eslint-disable-next-line import/prefer-default-export
export function byId (id) {
  if (!id)
    throw new Error('Required argument for `byId` is missing')

  this.params.id = id
  return this
}
