# `getErrorByCode(code)`

> From package [@commercetools/sdk-middleware-http](/docs/sdk/api/README.md#sdk-middleware-http).

Returns a [custom error type](/docs/sdk/Glossary.md#httperrortype) given its status *code*.

#### Arguments

1. `code` *(Number)*: the HTTP status code

#### Returns

(*Error* or *undefined*): A custom error type (e.g. `BadRequest`, `Unauthorized`) if the *code* matches, otherwise `undefined`.

#### Usage example

```js
import { getErrorByCode } from '@commercetools/sdk-middleware-http'

const ErrorType = getErrorByCode(400)
const error = new ErrorType('Oops')
```
