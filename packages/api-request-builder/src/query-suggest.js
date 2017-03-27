/* @flow */
/**
 * Define a Suggestion used for matching tokens for product projections,
 * via a suggest tokenizer.
 *
 * The suggestions can be used to implement a basic auto-complete functionality.
 * The source of data for suggestions is the searchKeyword field in a product.
 *
 * @param  {string} value - A non-URI encoded string representing a
 * text to search for.
 * @param  {string} lang - An ISO language tag, used for search
 * the given text in localized content.
 * @throws If `value` or `lang` is missing.
 * @return {Object} The instance of the service, can be chained.
 */
 // eslint-disable-next-line import/prefer-default-export
export function searchKeywords (value: string, lang: string): Object {
  if (!value || !lang)
    throw new Error('Required arguments for `searchKeywords` are missing')

  this.params.searchKeywords.push({ lang, value: encodeURIComponent(value) })
  return this
}
