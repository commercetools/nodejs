import createUserAgent from '../src/create-user-agent'

describe('for browser', () => {
  const userAgent = createUserAgent({
    name: 'foo',
    version: '1.0.0',
    url: 'http://foo.com',
  })

  it('has sdk info', () => {
    expect(userAgent).toMatch('commercetools-node-sdk')
  })
  it('has browser info', () => {
    // because we use jsdom
    expect(userAgent).toMatch('Node.js')
  })
  it('has browser version', () => {
    // because we use jsdom
    expect(userAgent).toMatch(process.version.slice(1))
  })
  it('has library info', () => {
    expect(userAgent).toMatch('foo/1.0.0')
  })
  it('has library url', () => {
    expect(userAgent).toMatch('http://foo.com')
  })
  it('has contact info', () => {
    expect(userAgent).toMatch('helpdesk@commercetools.com')
  })
})

describe('for node', () => {
  const userAgent = createUserAgent(
    {
      name: 'foo',
      version: '1.0.0',
      url: 'http://foo.com',
    },
    { /* to prevent using the window object */ },
  )

  it('has sdk info', () => {
    expect(userAgent).toMatch('commercetools-node-sdk')
  })
  it('has node info', () => {
    expect(userAgent).toMatch(`Node.js/${process.version.slice(1)}`)
  })
  it('has library info', () => {
    expect(userAgent).toMatch('foo/1.0.0')
  })
  it('has library url', () => {
    expect(userAgent).toMatch('http://foo.com')
  })
  it('has contact info', () => {
    expect(userAgent).toMatch('helpdesk@commercetools.com')
  })
})

describe('optional information', () => {
  it('create user agent without any information', () => {
    const userAgent = createUserAgent(
      {},
      { /* to prevent using the window object */ },
    )
    // eslint-disable-next-line max-len
    expect(userAgent).toBe(`commercetools-node-sdk Node.js/${process.version.slice(1)} (${process.platform}; ${process.arch}) (+helpdesk@commercetools.com)`)
  })
  it('create user agent with only library name (missing version)', () => {
    const userAgent = createUserAgent(
      {
        name: 'foo',
      },
      { /* to prevent using the window object */ },
    )
    // eslint-disable-next-line max-len
    expect(userAgent).toBe(`commercetools-node-sdk Node.js/${process.version.slice(1)} (${process.platform}; ${process.arch}) foo (+helpdesk@commercetools.com)`)
  })
  it('create user agent with library name and version', () => {
    const userAgent = createUserAgent(
      {
        name: 'foo',
        version: '1.0.0',
      },
      { /* to prevent using the window object */ },
    )
    // eslint-disable-next-line max-len
    expect(userAgent).toBe(`commercetools-node-sdk Node.js/${process.version.slice(1)} (${process.platform}; ${process.arch}) foo/1.0.0 (+helpdesk@commercetools.com)`)
  })
  it('create user agent with solution url', () => {
    const userAgent = createUserAgent(
      {
        url: 'http://foo.com',
      },
      { /* to prevent using the window object */ },
    )
    // eslint-disable-next-line max-len
    expect(userAgent).toBe(`commercetools-node-sdk Node.js/${process.version.slice(1)} (${process.platform}; ${process.arch}) (+http://foo.com; +helpdesk@commercetools.com)`)
  })
})
