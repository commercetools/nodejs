import * as queryPage from '../src/query-page'
import { getDefaultQueryParams } from '../src/default-params'

describe('queryPage', () => {
  let service

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...queryPage }
  })

  it('should set the sort param (asc)', () => {
    service.sort('createdAt')
    expect(service.params.pagination.sort).toEqual([
      encodeURIComponent('createdAt asc'),
    ])
  })

  it('should set the sort param (desc)', () => {
    service.sort('createdAt', false)
    expect(service.params.pagination.sort).toEqual([
      encodeURIComponent('createdAt desc'),
    ])
  })

  it('should throw if sortPath is missing', () => {
    expect(() => service.sort()).toThrowError(
      /Required argument for `sort` is missing/,
    )
  })

  it('should set the page param', () => {
    service.page(5)
    expect(service.params.pagination.page).toBe(5)
  })

  it('should throw if page is missing', () => {
    expect(() => service.page()).toThrowError(
      /Required argument for `page` is missing/,
    )
  })

  it('should throw if page is a number < 1', () => {
    expect(() => service.page(0)).toThrowError(
      /Required argument for `page` must be a number >= 1/,
    )
  })

  it('should set the perPage param', () => {
    service.perPage(40)
    expect(service.params.pagination.perPage).toBe(40)

    service.perPage(0)
    expect(service.params.pagination.perPage).toBe(0)
  })

  it('should throw if perPage is missing', () => {
    expect(() => service.perPage()).toThrowError(
      /Required argument for `perPage` is missing/,
    )
  })

  it('should throw if perPage is a number < 1', () => {
    expect(() => service.perPage(-1)).toThrowError(
      /Required argument for `perPage` must be a number >= 0/,
    )
  })
})
