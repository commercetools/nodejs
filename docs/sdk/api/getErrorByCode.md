# `getErrorByCode(code)`

Returns a [custom error type](/docs/sdk/Glossary,md#httperrortype) given its status *code*.

#### Arguments

1. `code` *(Number)*: the HTTP status code

#### Returns

(*Error* or *undefined*): A custom error type (e.g. `BadRequest`, `Unauthorized`) if the *code* matches, otherwise `undefined`.

#### Example

```js
import { getErrorByCode } from '@commercetools/sdk-middleware-http'

const ErrorType = getErrorByCode(400)
const error = new ErrorType('Oops')
```
