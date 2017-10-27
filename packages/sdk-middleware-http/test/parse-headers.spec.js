import parseHeaders from '../src/parse-headers';

describe('Parse headers', () => {
  it('return headers for polyfill (node-fetch)', () => {
    const spy = jest.fn();
    parseHeaders({ raw: spy });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('return headers for polyfill (whatwg-fetch)', () => {
    const spy = jest
      .fn()
      .mockImplementation(cb => cb(['application/json'], 'content-type'));
    expect(parseHeaders({ forEach: spy })).toEqual({
      'content-type': ['application/json'],
    });
  });

  it('patch fix for firefox', () => {
    expect(parseHeaders({})).toEqual({});
  });
});
