---
'@commercetools/sdk-middleware-http': patch
---

Allow to unset the `content-type` HTTP header by explicitly passing `null` as the value.

A use case for that is using `FormData` as the request body, for example to perform a file upload. The browser generally sets the `content-type` HTTP header automatically.
