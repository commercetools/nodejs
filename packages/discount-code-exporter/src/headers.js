/* @flow */
// eslint-disable-next-line import/prefer-default-export
export const defaultHeaders = (language: string): Array<string> => [
  `name.${language}`,
  `description.${language}`,
  'code',
  'cartDiscounts',
  'cartPredicate',
  'groups',
  'isActive',
  'validFrom',
  'validUntil',
  'references',
  'maxApplications',
  'maxApplicationsPerCustomer',
]
