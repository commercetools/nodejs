import {
  Dispatch,
  MiddlewareRequest,
  MiddlewareResponse,
  JsonObject,
} from '@commercetools/sdk-types'
import { createUserAgentMiddleware } from '../src'

describe('UserAgent', () => {
  const userAgentMiddleware = createUserAgentMiddleware({
    libraryName: 'my-awesome-library',
    libraryVersion: '1.0.0',
    contactUrl: 'https://commercetools.com',
    contactEmail: 'helpdesk@commercetools.com',
  })
  const request: MiddlewareRequest = {
    method: 'GET',
    uri: '/foo',
    headers: {
      Authorization: '123',
    },
  }
  const response: MiddlewareResponse = {
    statusCode: 200,
    resolve: jest.fn(),
    reject: jest.fn(),
  }

  const next: Dispatch = (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: JsonObject<string> = req.headers as any
    test('has the same given header', () => {
      expect(headers.Authorization).toBe('123')
    })
    test('has sdk info', () => {
      expect(headers['User-Agent']).toMatch('commercetools-js-sdk')
    })
    test('has browser info', () => {
      // because we use jsdom
      expect(headers['User-Agent']).toMatch('Node.js')
    })
    test('has browser version', () => {
      // because we use jsdom
      expect(headers['User-Agent']).toMatch(process.version.slice(1))
    })
    test('has library info', () => {
      expect(headers['User-Agent']).toMatch('my-awesome-library/1.0.0')
    })
    test('has library url', () => {
      expect(headers['User-Agent']).toMatch('https://commercetools.com')
    })
    test('has contact info', () => {
      expect(headers['User-Agent']).toMatch('helpdesk@commercetools.com')
    })
    test('do not change response object', () => {
      expect(res).toEqual({ ...res })
    })
  }
  userAgentMiddleware(next)(request, response)
})
