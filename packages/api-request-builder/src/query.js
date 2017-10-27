/**
 * Set the given `predicate` to the internal state of the service instance.
 *
 * @param  {string} predicate - A non-URI encoded string representing a
 * [Predicate]{@link http://dev.sphere.io/http-api.html#predicates}
 * @throws If `predicate` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
export function where(predicate: string): Object {
  if (!predicate) throw new Error('Required argument for `where` is missing');

  const encodedPredicate = encodeURIComponent(predicate);
  this.params.query.where.push(encodedPredicate);
  return this;
}

/**
 * Set the logical operator to combine multiple query predicates
 * {@link module:commons/query.where}
 *
 * @param  {string} operator - A logical operator `and`, `or`
 * @throws If `operator` is missing or has a wrong value.
 * @return {Object} The instance of the service, can be chained.
 */
export function whereOperator(operator: 'and' | 'or'): Object {
  if (!operator)
    throw new Error('Required argument for `whereOperator` is missing');
  if (!(operator === 'and' || operator === 'or'))
    throw new Error(
      'Required argument for `whereOperator` is invalid, ' +
        'allowed values are (`and`, `or`)'
    );

  this.params.query.operator = operator;
  return this;
}
