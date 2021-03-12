import qs from 'querystring'
import { createClient } from '../src'

const createPayloadResult = (tot, startingId = 0) => ({
  count: tot,
  results: Array.from(Array(tot), (val, index) => ({
    id: String(index + 1 + startingId),
  })),
})

describe('validate options', () => {
  test('middlewares (required)', () => {
    expect(() => createClient()).toThrow('Missing required options')
  })
  test('middlewares (array)', () => {
    expect(() => createClient({ middlewares: {} })).toThrow(
      'Middlewares should be an array'
    )
  })
  test('middlewares (empty)', () => {
    expect(() => createClient({ middlewares: [] })).toThrow(
      'You need to provide at least one middleware'
    )
  })
})

describe('api', () => {
  const middlewares = [(next) => (...args) => next(...args)]
  const client = createClient({ middlewares })
  const request = {
    uri: '/foo',
    method: 'POST',
  }

  test('expose "execute" function', () => {
    expect(typeof client.execute).toBe('function')
  })

  test('execute should return a promise', () => {
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

  test('should throw if request is missing', () => {
    const middlewares = [(next) => (...args) => next(...args)]
    const client = createClient({ middlewares })
    expect(() => client.execute()).toThrow(
      /The "exec" function requires a "Request" object/
    )
  })

  test('should throw if request uri is invalid', () => {
    const middlewares = [(next) => (...args) => next(...args)]
    const client = createClient({ middlewares })
    const badRequest = {
      ...request,
      uri: 24,
    }
    expect(() => client.execute(badRequest)).toThrow(
      /The "exec" Request object requires a valid uri/
    )
  })

  test('should throw if request method is invalid', () => {
    const middlewares = [(next) => (...args) => next(...args)]
    const client = createClient({ middlewares })
    const badRequest = {
      ...request,
      method: 'INVALID_METHOD',
    }
    expect(() => client.execute(badRequest)).toThrow(
      /The "exec" Request object requires a valid method./
    )
  })

  test('execute and resolve a simple request', () => {
    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const headers = {
            Authorization: 'Bearer 123',
          }
          next({ ...req, headers }, res)
        },
        (next) => (req, res) => {
          const body = {
            id: '123',
            version: 1,
          }
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client.execute(request).then((response) => {
      expect(response).toEqual({
        body: {
          id: '123',
          version: 1,
        },
        statusCode: 200,
      })
    })
  })

  test('execute and reject a request', () => {
    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const error = new Error('Invalid password')
          next(req, { ...res, error, statusCode: 400 })
        },
      ],
    })

    return client
      .execute(request)
      .then(() =>
        Promise.reject(
          new Error(
            'This function should never be called, the response was rejected'
          )
        )
      )
      .catch((error) => {
        expect(error.message).toEqual('Invalid password')
        return Promise.resolve()
      })
  })

  describe('ensure correct functions are used to resolve the promise', () => {
    test('resolve', () => {
      const customResolveSpy = jest.fn()
      const client = createClient({
        middlewares: [
          (next) => (req, res) => {
            const responseWithCustomResolver = {
              resolve() {
                customResolveSpy()
                res.resolve()
              },
            }
            next(req, responseWithCustomResolver)
          },
        ],
      })

      return client.execute(request).then(() => {
        expect(customResolveSpy).toHaveBeenCalled()
      })
    })

    test('reject', () => {
      const customRejectSpy = jest.fn()
      const client = createClient({
        middlewares: [
          (next) => (req, res) => {
            const responseWithCustomResolver = {
              reject() {
                customRejectSpy()
                res.reject()
              },
              error: new Error('Oops'),
            }
            next(req, responseWithCustomResolver)
          },
        ],
      })

      return client.execute(request).catch(() => {
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
    const middlewares = [(next) => (...args) => next(...args)]
    const client = createClient({ middlewares })

    test('should throw if second argument missing', () => {
      expect(() => client.process(request)).toThrow(
        /The "process" function accepts a "Function"/
      )
    })

    test('should throw if second argument is not a function', () => {
      expect(() => client.process(request, 'foo')).toThrow(
        /The "process" function accepts a "Function"/
      )
    })

    test('should throw if request method is not `GET`', () => {
      expect(() =>
        client.process({ uri: 'foo', method: 'POST' }, () => {})
      ).toThrow(/The "process" Request object requires a valid method/)
    })
  })

  test('process and resolve paginating 3 times', () => {
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
        (next) => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1])).toEqual(
            reqStubs[reqCount].query
          )

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client
      .process(request, () => Promise.resolve('OK'))
      .then((response) => {
        expect(response).toEqual(['OK', 'OK', 'OK'])
      })
  })

  test('return only the required number of items', () => {
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
        body: createPayloadResult(6),
        query: {
          sort: 'id asc',
          withTotal: 'false',
          where: 'id > "20"',
          limit: '6',
        },
      },
    }

    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1])).toEqual(
            reqStubs[reqCount].query
          )

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client
      .process(request, () => Promise.resolve('OK'), { total: 46 })
      .then((response) => {
        expect(response).toEqual(['OK', 'OK', 'OK'])
      })
  })

  test('disabling sort', () => {
    let reqCount = 0
    const reqStubs = {
      0: {
        body: createPayloadResult(20),
        query: {
          withTotal: 'false',
          limit: '20',
        },
      },
      1: {
        body: createPayloadResult(20),
        query: {
          withTotal: 'false',
          limit: '20',
        },
      },
      2: {
        body: createPayloadResult(6),
        query: {
          withTotal: 'false',
          limit: '20',
        },
      },
    }

    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1])).toEqual(
            reqStubs[reqCount].query
          )

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    return client
      .process(request, () => Promise.resolve('OK'), { disableSort: true })
      .then((response) => {
        expect(response).toEqual(['OK', 'OK', 'OK'])
      })
  })

  test('process and resolve pagination by preserving original query', () => {
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
        (next) => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1])).toEqual(
            reqStubs[reqCount].query
          )

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
      () => Promise.resolve('OK')
    )
  })

  test('process should not call fn when last page is empty', async () => {
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
        body: createPayloadResult(5, 5),
        query: {
          sort: ['id asc', 'createdAt desc'],
          withTotal: 'false',
          where: ['id > "5"', 'name (en = "Foo")'],
          limit: '5',
        },
      },
      2: {
        body: createPayloadResult(0),
        query: {
          sort: ['id asc', 'createdAt desc'],
          withTotal: 'false',
          where: ['id > "10"', 'name (en = "Foo")'],
          limit: '5',
        },
      },
    }

    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const body = reqStubs[reqCount].body
          expect(qs.parse(req.uri.split('?')[1])).toEqual(
            reqStubs[reqCount].query
          )

          reqCount += 1
          next(req, { ...res, body, statusCode: 200 })
        },
      ],
    })

    let fnCall = 0
    const processRes = await client.process(
      {
        ...request,
        uri: `${request.uri}?${qs.stringify({
          sort: 'createdAt desc',
          where: 'name (en = "Foo")',
          limit: 5,
        })}`,
      },
      (res) => {
        expect(res.body.results).toEqual(reqStubs[fnCall].body.results)
        expect(fnCall).toBeLessThan(2) // should not call fn if the last page is empty

        fnCall += 1

        return `OK${fnCall}`
      },
      {
        accumulate: true,
      }
    )

    expect(processRes).toEqual(['OK1', 'OK2']) // results from fn calls
    expect(fnCall).toBe(2) // fn was called two times
  })

  test('process and reject a request', () => {
    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          const error = new Error('Invalid password')
          next(req, { ...res, error, statusCode: 400 })
        },
      ],
    })

    return client
      .process(request, () => Promise.resolve('OK'))
      .then(() =>
        Promise.reject(
          new Error(
            'This function should never be called, the response was rejected'
          )
        )
      )
      .catch((error) => {
        expect(error.message).toEqual('Invalid password')
        return Promise.resolve()
      })
  })

  test('process and reject on rejection from user', () => {
    const client = createClient({
      middlewares: [
        (next) => (req, res) => {
          next(req, { ...res, statusCode: 200 })
        },
      ],
    })

    return client
      .process(request, () => Promise.reject(new Error('Rejection from user')))
      .then(() =>
        Promise.reject(
          new Error(
            'This function should never be called, the response was rejected'
          )
        )
      )
      .catch((error) => {
        expect(error).toEqual(new Error('Rejection from user'))
      })
  })
})
