import qs from 'querystring'
import {
  createClient,
} from '../src'

describe('validate options', () => {
  it('middlewares (required)', () => {
    expect(() => createClient()).toThrowError(
      'Missing required options',
    )
  })
  it('middlewares (array)', () => {
    expect(() => createClient({ middlewares: {} })).toThrowError(
      'Middlewares should be an array',
    )
  })
  it('middlewares (empty)', () => {
    expect(() => createClient({ middlewares: [] })).toThrowError(
      'You need to provide at least one middleware',
    )
  })
})

describe('api', () => {
  const middlewares = [
    next => (...args) => next(...args),
  ]
  const client = createClient({ middlewares })
  const request = {
    uri: '/foo',
    method: 'POST',
  }

  it('expose "execute" function', () => {
    expect(typeof client.execute).toBe('function')
  })

  it('execute should return a promise', () => {
    const promise = client.execute(request)
    expect(promise.then).toBeDefined()
  })
})

describe('execute', () => {
  const request = {
    uri: '/test/products',
    method: 'GET',
    body: null,
    headers: {},
  }

  it('should throw if request is missing', () => {
    const middlewares = [
      next => (...args) => next(...args),
    ]
    const client = createClient({ middlewares })
    expect(() => client.execute())
      .toThrowError(/The "exec" function requires a "Request" object/)
  })

  it('should throw if request uri is invalid', () => {
    const middlewares = [
      next => (...args) => next(...args),
    ]
    const client = createClient({ middlewares })
    const badRequest = {
      ...request,
      uri: 24,
    }
    expect(() => client.execute(badRequest))
      .toThrowError(/The "exec" Request object requires a valid uri/)
  })

  it('should throw if request method is invalid', () => {
    const middlewares = [
      next => (...args) => next(...args),
    ]
    const client = createClient({ middlewares })
    const badRequest = {
      ...request,
      method: 'INVALID_METHOD',
    }
    expect(() => client.execute(badRequest))
      .toThrowError(/The "exec" Request object requires a valid method./)
  })

  it('execute and resolve a simple request', () => {
    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const headers = {
            Authorization: 'Bearer 123',
          }
          next({ ...req, headers }, res)
        },
        next => (req, res) => {
          const body = {
            id: '123',
            version: 1,
          }
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client.execute(request)
    .then((response) => {
      expect(response).toEqual({
        body: {
          id: '123',
          version: 1,
        },
        statusCode: 200,
      })
    })
  })

  it('execute and reject a request', () => {
    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const error = new Error('Invalid password')
          next(req, { ...res, error, statusCode: 400 })
        },
      ],
    })

    return client.execute(request)
    .then(() =>
      Promise.reject(
        'This function should never be called, the response was rejected',
      ),
    )
    .catch((error) => {
      expect(error.message).toEqual('Invalid password')
      return Promise.resolve()
    })
  })

  describe('ensure correct functions are used to resolve the promise', () => {
    it('resolve', () => {
      const customResolveSpy = jest.fn()
      const client = createClient({
        middlewares: [
          next => (req, res) => {
            const responseWithCustomResolver = {
              resolve () {
                customResolveSpy()
                res.resolve()
              },
            }
            next(req, responseWithCustomResolver)
          },
        ],
      })

      return client.execute(request)
      .then(() => {
        expect(customResolveSpy).toHaveBeenCalled()
      })
    })

    it('reject', () => {
      const customRejectSpy = jest.fn()
      const client = createClient({
        middlewares: [
          next => (req, res) => {
            const responseWithCustomResolver = {
              reject () {
                customRejectSpy()
                res.reject()
              },
              error: new Error('Oops'),
            }
            next(req, responseWithCustomResolver)
          },
        ],
      })

      return client.execute(request)
      .catch(() => {
        expect(customRejectSpy).toHaveBeenCalled()
      })
    })
  })
})

describe('process', () => {
  const request = {
    uri: '/test/products',
    method: 'GET',
    body: null,
    headers: {},
  }

  describe('validate arguments', () => {
    const middlewares = [
      next => (...args) => next(...args),
    ]
    const client = createClient({ middlewares })

    it('should throw if second argument missing', () => {
      expect(() => client.process(request))
        .toThrow(/The "process" function accepts a "Function"/)
    })

    it('should throw if second argument is not a function', () => {
      expect(() => client.process(request, 'foo'))
        .toThrow(/The "process" function accepts a "Function"/)
    })

    it('should throw if request method is not `GET`', () => {
      expect(() => client.process({ uri: 'foo', method: 'POST' }, () => {}))
        .toThrowError(/The "process" Request object requires a valid method/)
    })
  })

  it('process and resolve paginating 3 times', () => {
    const createPayloadResult = tot => ({
      results: Array.from(
        Array(tot),
        (val, index) => ({ id: String(index + 1) }),
      ),
    })
    let reqCount = 0
    const reqStubs = {
      0: {
        body: createPayloadResult(20),
        query: {
          sort: 'id asc',
          withTotal: 'false',
          limit: '20',
        },
      },
      1: {
        body: createPayloadResult(20),
        query: {
          sort: 'id asc',
          withTotal: 'false',
          where: 'id > "20"',
          limit: '20',
        },
      },
      2: {
        body: createPayloadResult(10),
        query: {
          sort: 'id asc',
          withTotal: 'false',
          where: 'id > "20"',
          limit: '20',
        },
      },
    }

    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1]))
            .toEqual(reqStubs[reqCount].query)

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client.process(
      request,
      () => Promise.resolve('OK'),
    )
    .then((response) => {
      expect(response).toEqual([
        'OK',
        'OK',
        'OK',
      ])
    })
  })

  it('process and resolve paginating once if limit is passed in', () => {
    const limitRequest = { ...request, uri: '/test/produ?limit=26' }
    const createPayloadResult = tot => ({
      results: Array.from(
        Array(tot),
        (val, index) => ({ id: String(index + 1) }),
      ),
    })
    let reqCount = 0
    const reqStubs = {
      0: {
        body: createPayloadResult(20),
      },
      1: {
        body: createPayloadResult(20),
      },
      2: {
        body: createPayloadResult(10),
      },
    }

    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const body = reqStubs[reqCount].body

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    const spy = jest.spyOn(client, 'execute')
    return client.process(
      limitRequest,
      () => Promise.resolve('OK'),
    )
    .then((response) => {
      expect(response).toEqual([
        'OK',
      ])
      // client.execute is always called n + 1 times
      expect(client.execute).toHaveBeenCalledTimes(2)
      spy.mockReset()
      spy.mockRestore()
    })
  })

  it('process and resolve pagination by preserving original query', () => {
    const createPayloadResult = tot => ({
      results: Array.from(
        Array(tot),
        (val, index) => ({ id: String(index + 1) }),
      ),
    })
    let reqCount = 0
    const reqStubs = {
      0: {
        body: createPayloadResult(5),
        query: {
          sort: ['id asc', 'createdAt desc'],
          withTotal: 'false',
          where: 'name (en = "Foo")',
          limit: '5',
        },
      },
      1: {
        body: createPayloadResult(2),
        query: {
          sort: ['id asc', 'createdAt desc'],
          withTotal: 'false',
          where: ['id > "5"', 'name (en = "Foo")'],
          limit: '5',
        },
      },
    }

    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1]))
            .toEqual(reqStubs[reqCount].query)

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client.process(
      {
        ...request,
        uri: `${request.uri}?${qs.stringify({
          sort: 'createdAt desc',
          where: 'name (en = "Foo")',
          limit: 5,
        })}`,
      },
      () => Promise.resolve('OK'),
    )
  })

  it('process and reject a request', () => {
    const client = createClient({
      middlewares: [
        next => (req, res) => {
          const error = new Error('Invalid password')
          next(req, { ...res, error, statusCode: 400 })
        },
      ],
    })

    return client.process(
      request,
      () => Promise.resolve('OK'),
    )
    .then(() =>
      Promise.reject(
        'This function should never be called, the response was rejected',
      ),
    )
    .catch((error) => {
      expect(error.message).toEqual('Invalid password')
      return Promise.resolve()
    })
  })

  it('process and reject on rejection from user', () => {
    const client = createClient({
      middlewares: [
        next => (req, res) => {
          next(req, { ...res, statusCode: 200 })
        },
      ],
    })

    return client.process(
      request,
      () => Promise.reject('Rejection from user'),
    )
    .then(() =>
      Promise.reject(
        'This function should never be called, the response was rejected',
      ),
    )
    .catch((error) => {
      expect(error).toEqual('Rejection from user')
    })
  })
})
