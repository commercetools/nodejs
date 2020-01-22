import { ApiRequestExecutor } from 'shared/utils/requests-utils'
import { MiddlewareArg, VariableMap } from 'shared/utils/common-types'
import * as url from 'url'

describe('ApiRequestExecutor', () => {
  describe('query parameters', () => {
    async function testQuery(params: VariableMap | undefined) {
      const middleware = jest.fn(async (args: MiddlewareArg) => {
        return {
          ...args,
          response: { body: undefined, statusCode: 200 },
        }
      })

      const executor = new ApiRequestExecutor([middleware])

      const args = {
        baseURL: 'http://base-url',
        method: 'GET' as const,
        uriTemplate: '',
        queryParams: params,
      }

      await executor.execute(args)

      expect(middleware).toHaveBeenCalledTimes(1)
      return url.parse(middleware.mock.calls[0][0].request.uri).query
    }

    test('handle single element array query parameters', async () => {
      expect(await testQuery({ foo: ['bar'] })).toEqual('foo=bar')
    })

    test('handle array query parameters', async () => {
      expect(await testQuery({ foo: ['bar', 'baz'] })).toEqual(
        'foo=bar&foo=baz'
      )
    })

    test('handle number query parameters', async () => {
      expect(await testQuery({ foo: 123 })).toEqual('foo=123')
    })

    test('handle boolean query parameters', async () => {
      expect(await testQuery({ foo: true, bar: false })).toEqual(
        'foo=true&bar=false'
      )
    })

    test('handle invalid characters', async () => {
      expect(await testQuery({ foo: '<>abc /' })).toEqual('foo=%3C%3Eabc%20%2F')
    })

    test('handle empty arrays', async () => {
      expect(await testQuery({ foo: [] })).toBeNull()
    })

    test('handle empty arrays after defined property', async () => {
      expect(await testQuery({ bar: 'baz', foo: [] })).toEqual('bar=baz')
    })

    test('remove undefined and null', async () => {
      expect(
        await testQuery({
          nullValue: null as any,
          undefinedValue: undefined,
          value: 'bar',
        })
      ).toEqual('value=bar')
    })

    test('remove undefined and null values in array', async () => {
      expect(
        await testQuery({ foo: [null as any, 'bar', undefined, 'baz'] })
      ).toEqual('foo=bar&foo=baz')
    })

    test('handle undefined variable map', async () => {
      expect(await testQuery(undefined)).toBeNull()
    })
  })
})
