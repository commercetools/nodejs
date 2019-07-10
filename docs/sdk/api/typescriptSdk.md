# `typescript-sdk`(Alpha package)

A package used to provide typescript definitions on top of ctp client

![example usage](typescript_tutorial.gif)

## Install

#### Node.js

```bash
npm install --save @commercetools/typescript-sdk
```

#### Browser

```html
<script src="https://unpkg.com/@commercetools/typescript-sdk/lib/typescript-sdk.umd.min.js"></script>
<script>
  // global: TypescriptSdk
</script>
```

#### Usage example

```ts
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-middleware-auth";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createClient } from "@commercetools/sdk-client";
import { createApiBuilderFromCtpClient, ApiRoot } from "@commercetools/typescript-sdk";

import fetch = require("node-fetch");

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: "https://auth.sphere.io",
  projectKey,
  scopes,
  credentials: {
    clientId: "some_id",
    clientSecret: "some_secret"
  },
  fetch
});

const httpMiddleware = createHttpMiddleware({
  host: "https://api.sphere.io",
  fetch
});

const ctpClient = createClient({
  middlewares:[authMiddleware,httpMiddleware]
})


const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient)

apiRoot.withProjectKeyValue({
            projectKey:'some_project_key'
        })
        .get()
        .execute()
        .then(x => ...)
```
