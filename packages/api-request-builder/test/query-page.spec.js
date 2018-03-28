import * as queryPage from '../src/query-page'
import { getDefaultQueryParams } from '../src/default-params'

describe('queryPage', () => {
  let service

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...queryPage }
  })

  test('should set the sort param (asc)', () => {
    service.sort('createdAt')
    expect(service.params.pagination.sort).toEqual([
      encodeURIComponent('createdAt asc'),
    ])
  })

  test('should set the sort param (desc)', () => {
    service.sort('createdAt', false)
    expect(service.params.pagination.sort).toEqual([
      encodeURIComponent('createdAt desc'),
    ])
  })

  test('should throw if sortPath is missing', () => {
    expect(() => service.sort()).toThrowError(
      /Required argument for `sort` is missing/
    )
  })

  test('should set the page param', () => {
    service.page(5)
    expect(service.params.pagination.page).toBe(5)
  })

  test('should throw if page is missing', () => {
    expect(() => service.page()).toThrowError(
      /Required argument for `page` is missing/
    )
  })

  test('should throw if page is a number < 1', () => {
    expect(() => service.page(0)).toThrowError(
      /Required argument for `page` must be a number >= 1/
    )
  })

  test('should set the perPage param', () => {
    service.perPage(40)
    expect(service.params.pagination.perPage).toBe(40)

    service.perPage(0)
    expect(service.params.pagination.perPage).toBe(0)
  })

  test('should throw if perPage is missing', () => {
    expect(() => service.perPage()).toThrowError(
      /Required argument for `perPage` is missing/
    )
  })

  test('should throw if perPage is a number < 1', () => {
    expect(() => service.perPage(-1)).toThrowError(
      /Required argument for `perPage` must be a number >= 0/
    )
  })
})
