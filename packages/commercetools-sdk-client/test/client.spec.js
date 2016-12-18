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
})
