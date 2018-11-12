import * as queryLocation from '../src/query-location'
import { getDefaultQueryParams } from '../src/default-params'

describe('queryLocation', () => {
  let service

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...queryLocation }
  })

  test('should set the country param', () => {
    service.byCountry('DE')
    expect(service.params.location.country).toEqual('DE')
  })

  test('should set the currency param', () => {
    service.byCountry('DE')
    service.byCurrency('EUR')
    expect(service.params.location.currency).toEqual('EUR')
  })

  test('should set the state param', () => {
    service.byCountry('DE')
    service.byState('Germany')
    expect(service.params.location.state).toEqual('Germany')
  })

  test('should throw if country is missing', () => {
    expect(() => service.byCountry()).toThrow(
      /Required argument for `byCountry` is missing/
    )
  })

  test('should throw if currency is missing', () => {
    expect(() => service.byCurrency()).toThrow(
      /Required argument for `byCurrency` is missing/
    )
  })

  test('should throw if state is missing', () => {
    expect(() => service.byState()).toThrow(
      /Required argument for `byState` is missing/
    )
  })

  test('should throw while using byCurrency if country was not set', () => {
    expect(() => service.byCurrency('EUR')).toThrow(
      // eslint-disable-next-line max-len
      /A `country` for this resource has not been set.*./
    )
  })

  test('should throw while using byState if country was not set', () => {
    expect(() => service.byState('Germany')).toThrow(
      // eslint-disable-next-line max-len
      /A `country` for this resource has not been set.*/
    )
  })
})
