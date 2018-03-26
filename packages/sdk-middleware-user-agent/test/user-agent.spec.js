import { createUserAgentMiddleware } from '../src'

describe('UserAgent', () => {
  const userAgentMiddleware = createUserAgentMiddleware({
    libraryName: 'my-awesome-library',
    libraryVersion: '1.0.0',
    contactUrl: 'https://commercetools.com',
    contactEmail: 'helpdesk@commercetools.com',
  })
  const request = {
    headers: {
      Authorization: '123',
    },
  }

  const next = (req, res) => {
    test('has the same given header', () => {
      expect(req.headers.Authorization).toBe('123')
    })
    test('has sdk info', () => {
      expect(req.headers['User-Agent']).toMatch('commercetools-js-sdk')
    })
    test('has browser info', () => {
      // because we use jsdom
      expect(req.headers['User-Agent']).toMatch('Node.js')
    })
    test('has browser version', () => {
      // because we use jsdom
      expect(req.headers['User-Agent']).toMatch(process.version.slice(1))
    })
    test('has library info', () => {
      expect(req.headers['User-Agent']).toMatch('my-awesome-library/1.0.0')
    })
    test('has library url', () => {
      expect(req.headers['User-Agent']).toMatch('https://commercetools.com')
    })
    test('has contact info', () => {
      expect(req.headers['User-Agent']).toMatch('helpdesk@commercetools.com')
    })
    test('do not change response object', () => {
      expect(res).toEqual({})
    })
  }
  userAgentMiddleware(next)(request, {})
})
