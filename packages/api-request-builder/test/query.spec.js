import * as query from '../src/query'
import { getDefaultQueryParams } from '../src/default-params'

describe('query', () => {
  let service

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...query }
  })

  test('should set the where param', () => {
    service.where('name(en = "Foo Bar")')
    expect(service.params.query.where).toEqual([
      encodeURIComponent('name(en = "Foo Bar")'),
    ])
  })

  test('should throw if predicate is missing', () => {
    expect(() => service.where()).toThrow(
      /Required argument for `where` is missing/
    )
  })

  test('should set the whereOperator param', () => {
    service.whereOperator('or')
    expect(service.params.query.operator).toBe('or')

    service.whereOperator('and')
    expect(service.params.query.operator).toBe('and')
  })

  test('should throw if whereOperator is missing', () => {
    expect(() => service.whereOperator()).toThrow(
      /Required argument for `whereOperator` is missing/
    )
  })

  test('should throw if whereOperator is wrong', () => {
    expect(() => service.whereOperator('foo')).toThrow(
      // eslint-disable-next-line max-len
      /Required argument for `whereOperator` is invalid, allowed values are \(`and`, `or`\)/
    )
  })
})
