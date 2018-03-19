import { createClient } from '../src'

const identityMiddleware = (/* dispatch */) => next => request => next(request)

describe('validate options', () => {
  it('middlewares (required)', () => {
    expect(() => createClient()).toThrowError('Missing required options')
  })
  it('middlewares (array)', () => {
    expect(() => createClient({ middlewares: {} })).toThrowError(
      'Middlewares should be an array'
    )
  })
  it('middlewares (empty)', () => {
    expect(() => createClient({ middlewares: [] })).toThrowError(
      'You need to provide at least one middleware'
    )
  })
})

describe('api', () => {
  const middlewares = [identityMiddleware]
  const client = createClient({ middlewares })
  const request = {
    uri: '/foo',
    method: 'POST',
  }

  it('exposes "execute" function', () => {
    expect(typeof client.execute).toBe('function')
  })

  it('execute should return the request', () => {
    expect(client.execute(request)).toBe(request)
  })
})

describe('execute', () => {
  const request = {
    uri: '/test/products',
    method: 'GET',
    body: null,
    headers: {},
  }

  describe('when request is invalid', () => {
    let client
    beforeEach(() => {
      const middlewares = [identityMiddleware]
      client = createClient({ middlewares })
    })

    describe('when request is missing', () => {
      it('should throw', () => {
        expect(() => client.execute()).toThrowError(
          /The "exec" function requires a "Request" object/
        )
      })
    })

    describe('when request uri is invalid', () => {
      it('should throw', () => {
        const badRequest = { ...request, uri: 24 }
        expect(() => client.execute(badRequest)).toThrowError(
          /The "exec" Request object requires a valid uri/
        )
      })
    })

    describe('when request method is invalid', () => {
      it('should throw', () => {
        const badRequest = { ...request, method: 'INVALID_METHOD' }
        expect(() => client.execute(badRequest)).toThrowError(
          /The "exec" Request object requires a valid method./
        )
      })
    })
  })

  describe('when request is valid', () => {
    let firstMiddleware
    let secondMiddleware
    let client
    let result
    beforeEach(() => {
      firstMiddleware = jest.fn(next => rq => next(rq))
      secondMiddleware = jest.fn(next => rq => next(rq))
      const middlewares = [() => firstMiddleware, () => secondMiddleware]
      client = createClient({ middlewares })
      result = client.execute(request)
    })
    it('should invoke every middleware', () => {
      expect(firstMiddleware).toHaveBeenCalledTimes(1)
      expect(secondMiddleware).toHaveBeenCalledTimes(1)
    })
    it('should pass the result of the latest middleware (the request)', () => {
      expect(result).toBe(request)
    })
  })
})
