# Testing

If you are testing a library or a project that uses the _SDK_ underneath, you probably don't want to make actual HTTP requests (unless you are doing integration tests).

### Mock requests with `nock` (recommended)
There are several approaches to mock the requests, the easiest one _we recommend to use_ is the [`nock`](https://github.com/node-nock/nock) library.
This library allows to deeply customize how you want to mock the actual node `http.request` and it's very declarative, making it easy to use. Let's see an example:

```js
// We'll mock a request to fetch some products
nock('https://api.commercetools.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .get('/my-project/products')
  .reply(
    200,
    {
      total: 2,
      count: 2,
      results: [{ id: '1' }, { id: '2' }],
    }
  )

// or mock a request to create a channel
nock('https://api.commercetools.com')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .filteringRequestBody(() => '*')
  .post('/my-project/channels', '*')
  .reply(201, { id: '1' })

// we could also do assertions on the body payload
.filteringRequestBody((body) => {
  expect(body).toBe(JSON.stringify({ foo: 'bar' }))
  return '*'
})

// Note that by default the defined mocks (or interceptors) are used only once
// https://github.com/node-nock/nock#read-this---about-interceptors
// To re-use the same interceptor for multiple requests simply call `persist()`
// https://github.com/node-nock/nock#persist
```

### Mock middlewares
Another approach would be to provide a `http-mock` _middleware_ that replaces the e.g. `http` _middleware_. It's a bit more work in terms of configuring the middleware for mocking different requests but it might be simpler for mocking requests in general and not caring about the response.

```js
import { getErrorByCode } from '@commercetools/sdk-middleware-http'
const BadRequest = getErrorByCode(400)
const httpMockSuccessMiddleware = next => (request, response) => {
  next(request, { ...response, body: { foo: 'bar' } })
}
const httpMockFailureMiddleware = next => (request, response) => {
  next(request, { ...response, error: new BadRequest('Invalid field') })
}
const client = createClient({
  middlewares: [
    authMiddleware,
    httpMockSuccessMiddleware,
    // httpMockFailureMiddleware,
  ],
})
```

### Mock modules
Furthermore, if you're using [`jest`](https://github.com/facebook/jest) for testing, you might decide to define [manual mocks](http://facebook.github.io/jest/manual-mocks.html#content) for the SDK modules. You might think of using this if you just want to mock the SDK modules altogether.

```js
// Note: once this PR is released (https://github.com/facebook/jest/pull/2483),
// setting up the mock can be done in
//   __mocks__/@commercetools/sdk-client.js
jest.mock('@commercetools/sdk-client', () =>
  () => ({ execute: jest.fn(() => Promise.resolve('Hello')) }),
)

const createClient = require('@commercetools/sdk-client')

const client = createClient()

function testImplementation (request, cb) {
  client.execute(request)
  .then(result => cb(null, result))
  .catch(error => cb(error))
}

describe('SDK client', () => {
  it('use mocked version', () =>
    new Promise((resolve, reject) => {
      testImplementation({ uri: '/foo/bar' }, (error, data) => {
        if (error) {
          reject(error)
          return
        }
        expect(client.execute).toHaveBeenLastCalledWith({ uri: '/foo/bar' })
        expect(data).toBe('Hello')
        resolve()
      })
    }),
  )
})
```
