import qs from 'querystring'
import {
  createClient,
} from '../src'

describe('validate options', () => {
  it('middlewares (required)', () => {
    expect(() => createClient()).toThrowError(
      'You need to provide at least one middleware',
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

  it('expose "execute" function', () => {
    expect(typeof client.execute).toBe('function')
  })

  it('execute should return a promise', () => {
    const promise = client.execute({})
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
})
