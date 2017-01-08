# Glossary

This is a glossary of the core terms around SDK packages, along with their type signatures. The types are documented using [Flow notation](http://flowtype.org/docs/quick-reference.html).

## ClientRequest

```js
type ClientRequest = {
  uri: string;
  method: MethodType;
  body?: string | Object;
  headers?: {
    [key: string]: string;
  }
}
```

A *ClientRequest* is an object describing the request that needs to be executed by the `sdk-client`. This is also the signature of the **request** object passed to a [middleware](/docs/sdk/Middlewares.md).

## ClientResponse

```js
type ClientResponse = {
  resolve(): void;
  reject(): void;
  body?: Object;
  error?: HttpErrorType;
  statusCode: number;
}
```

A *ClientResponse* is an object describing the **response** object passed to a [middleware](/docs/sdk/Middlewares.md).

## Middleware

```js
type Dispatch = (request: ClientRequest, response: ClientResponse) => any;
type Middleware = (next: Dispatch) => Dispatch;
```

A *Middleware* is a higher-order function that composes a *dispatch function* to return a new *dispatch function*.

Middleware is composable using function composition. It is used for authentication, making http requests, logging requests, etc. See section about [middlewares](/docs/sdk/Middlewares.md) for more information.

## Client

```js
type Client = {
  execute: (request: ClientRequest) => Promise<ClientResult>;
}
```

A *Client* is an object that contains functions to work with HTTP requests.  

- `execute(request)` is the main function to use for doing HTTP requests, using the provided middlewares.

### ClientResult

```js
type ClientResult = {
  body: ?Object;
  statusCode: number;
} | HttpErrorType
```

A *ClientResult* is the object returned by `execute`, depending if the response was *resolved* or *rejected*.

### HttpErrorType

```js
type HttpErrorType = {
  name: string;
  message: string;
  code: number;
  status: number;
  statusCode: number;
  body: Object;
  originalRequest: ClientRequest;
  headers?: {
    [key: string]: string;
  }
}
```

A *HttpErrorType* describes the shape of the `error` rejected by `execute`. The `error` is typed (e.g. `BadRequest`, `Unauthorized`) and contains useful meta information to help debug the cause of the error.

### SyncAction

```js
type UpdateAction = {
  action: string;
  [key: string]: any;
}
type SyncAction = {
  buildActions: (before: Object, now: Object) => Array<UpdateAction>;
}

type ActionGroup = {
  type: string;
  group: 'black' | 'white';
}
```
