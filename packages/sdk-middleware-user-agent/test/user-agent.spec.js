import { createUserAgentMiddleware } from '../src';

describe('UserAgent', () => {
  const userAgentMiddleware = createUserAgentMiddleware({
    libraryName: 'my-awesome-library',
    libraryVersion: '1.0.0',
    contactUrl: 'https://commercetools.com',
    contactEmail: 'helpdesk@commercetools.com',
  });
  const request = {
    headers: {
      Authorization: '123',
    },
  };

  const next = (req, res) => {
    it('has the same given header', () => {
      expect(req.headers.Authorization).toBe('123');
    });
    it('has sdk info', () => {
      expect(req.headers['User-Agent']).toMatch('commercetools-js-sdk');
    });
    it('has browser info', () => {
      // because we use jsdom
      expect(req.headers['User-Agent']).toMatch('Node.js');
    });
    it('has browser version', () => {
      // because we use jsdom
      expect(req.headers['User-Agent']).toMatch(process.version.slice(1));
    });
    it('has library info', () => {
      expect(req.headers['User-Agent']).toMatch('my-awesome-library/1.0.0');
    });
    it('has library url', () => {
      expect(req.headers['User-Agent']).toMatch('https://commercetools.com');
    });
    it('has contact info', () => {
      expect(req.headers['User-Agent']).toMatch('helpdesk@commercetools.com');
    });
    it('do not change response object', () => {
      expect(res).toEqual({});
    });
  };
  userAgentMiddleware(next)(request, {});
});
