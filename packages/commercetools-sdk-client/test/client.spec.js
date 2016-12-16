import {
  createClient,
} from '../src'

describe('Client', () => {
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
})
