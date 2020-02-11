import { VariableMap } from '../../../src/generated/shared/utils/common-types'
import { buildRelativeUri } from '../../../src/generated/shared/utils/uri-utils'

describe('ApiRequestExecutor', () => {
  describe('query parameters', () => {
    function testQuery(params: VariableMap | undefined): string {
      const request = {
        baseURL: 'http://base-url',
        method: 'GET' as const,
        uriTemplate: '',
        queryParams: params,
      }

      return buildRelativeUri(request)
    }

    test('handle single element array query parameters', async () => {
      expect(testQuery({ foo: ['bar'] })).toEqual('?foo=bar')
    })

    test('handle array query parameters', async () => {
      expect(testQuery({ foo: ['bar', 'baz'] })).toEqual('?foo=bar&foo=baz')
    })

    test('handle number query parameters', async () => {
      expect(testQuery({ foo: 123 })).toEqual('?foo=123')
    })

    test('handle boolean query parameters', async () => {
      expect(testQuery({ foo: true, bar: false })).toEqual(
        '?foo=true&bar=false'
      )
    })

    test('handle invalid characters', async () => {
      expect(testQuery({ foo: '<>abc /' })).toEqual('?foo=%3C%3Eabc%20%2F')
    })

    test('handle empty arrays', async () => {
      expect(testQuery({ foo: [] })).toEqual('')
    })

    test('handle empty arrays after defined property', async () => {
      expect(testQuery({ bar: 'baz', foo: [] })).toEqual('?bar=baz')
    })

    test('remove undefined and null', async () => {
      expect(
        testQuery({
          nullValue: null as any,
          undefinedValue: undefined,
          value: 'bar',
        })
      ).toEqual('?value=bar')
    })

    test('remove undefined and null values in array', async () => {
      expect(
        testQuery({ foo: [null as any, 'bar', undefined, 'baz'] })
      ).toEqual('?foo=bar&foo=baz')
    })

    test('handle undefined variable map', async () => {
      expect(testQuery(undefined)).toEqual('')
    })
  })
})
