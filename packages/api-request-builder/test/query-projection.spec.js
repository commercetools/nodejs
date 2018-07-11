import * as queryProjection from '../src/query-projection'

describe('queryProjection', () => {
  let service

  beforeEach(() => {
    service = { params: {}, ...queryProjection }
  })

  test('should set the staged param', () => {
    service.staged()
    expect(service.params.staged).toBeFalsy()

    service.staged(false)
    expect(service.params.staged).toBeFalsy()

    service.staged(true)
    expect(service.params.staged).toBeTruthy()
  })

  test('should set the priceCurrency param', () => {
    service.priceCurrency('EUR')
    expect(service.params.priceCurrency).toBe('EUR')
  })

  test('should set the priceCountry param', () => {
    service.priceCountry('DE')
    expect(service.params.priceCountry).toBe('DE')
  })

  test('should set the priceCustomerGroup param', () => {
    service.priceCustomerGroup('1234567890oiuytrewq')
    expect(service.params.priceCustomerGroup).toBe('1234567890oiuytrewq')
  })

  test('should set the priceChannel param', () => {
    service.priceChannel('1234567890oiuytrewq')
    expect(service.params.priceChannel).toBe('1234567890oiuytrewq')
  })
})
