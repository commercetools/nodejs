# Middlewares

If you've used libraries like [Express](http://expressjs.com/) and [Koa](http://koajs.com/), or [Redux](http://redux.js.org/), you were also probably already familiar with the concept of *middleware*. In these frameworks, a middleware is some code you can put between the framework receiving a request, and the framework generating a response. For example, Express or Koa middleware may add CORS headers, logging, compression, and more. The best feature of middleware is that it's composable in a chain. You can use multiple independent third-party middlewares in a single project.

The SDK middlewares work similarly to those concepts. Given an initial `request` and `response` definition, each middleware can do "side effects" and "transform" those objects, passing them to the next middleware in the chain. **This provides a third-party extension point for handling HTTP requests.**
For example, there are middlewares for doing authentication, for logging, for actually making the HTTP request, for retrying failed requests, etc.

The most important thing is the **contract** the middlewares have between each other: the [`request`](/docs/sdk/Glossary.md#clientrequest) and [`response`](/docs/sdk/Glossary.md#clientresponse) objects passed to each middleware have a *well predefined shape*, known to each middleware. This is important to ensure that middlewares can do side effects on those objects.

## Middlewares API

A *Middleware* is a higher-order function that composes a *dispatch function* to return a new *dispatch function*.

```js
const middleware = next => (request, response) => next(request, response)
```

The dispatch function accepts 2 arguments: [`request`](/docs/sdk/Glossary.md#clientrequest) and [`response`](/docs/sdk/Glossary.md#clientresponse) objects.
After doing the side effects, the middleware should call `next`, passing the (mutated) `request` and `response` to the next middleware.

## Implement a logging middleware

Let's see a simple practical example: a middleware that logs the incoming `request` and `response` objects.

```js
const loggerMiddleware = next => (request, response) => {
  const { statusCode, body, error } = response
  console.log('Request:', request)
  console.log('Response:', { statusCode, body, error })
  next(request, response)
}
```

See [official middlewares](/docs/sdk/api/README.md#middlewares) for more advanced examples.
