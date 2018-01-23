import * as queryLocation from '../src/query-location'
import { getDefaultQueryParams } from '../src/default-params'

describe('queryLocation', () => {
  let service

  beforeEach(() => {
    service = { params: getDefaultQueryParams(), ...queryLocation }
  })

  it('should set the country param', () => {
    service.byCountry('DE')
    expect(service.params.location.country).toEqual('DE')
  })

  it('should set the currency param', () => {
    service.byCountry('DE')
    service.byCurrency('EUR')
    expect(service.params.location.currency).toEqual('EUR')
  })

  it('should set the state param', () => {
    service.byCountry('DE')
    service.byState('Germany')
    expect(service.params.location.state).toEqual('Germany')
  })

  it('should throw if country is missing', () => {
    expect(() => service.byCountry()).toThrowError(
      /Required argument for `byCountry` is missing/
    )
  })

  it('should throw if currency is missing', () => {
    expect(() => service.byCurrency()).toThrowError(
      /Required argument for `byCurrency` is missing/
    )
  })

  it('should throw if state is missing', () => {
    expect(() => service.byState()).toThrowError(
      /Required argument for `byState` is missing/
    )
  })

  it('should throw while using byCurrency if country was not set', () => {
    expect(() => service.byCurrency('EUR')).toThrowError(
      // eslint-disable-next-line max-len
      /A `country` for this resource has not been set.*./
    )
  })

  it('should throw while using byState if country was not set', () => {
    expect(() => service.byState('Germany')).toThrowError(
      // eslint-disable-next-line max-len
      /A `country` for this resource has not been set.*/
    )
  })
})
