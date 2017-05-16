/* @flow */

import type {
  loggerOptions,
  apiConfigOptions,
  chunkOptions,
} from 'types/discountCodes'
import npmlog from 'npmlog'
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow }
  from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
import { createUserAgentMiddleware }
  from '@commercetools/sdk-middleware-user-agent'
import { version } from '../package.json'

export default class CodeImport {
  constructor (logger: loggerOptions, apiConfig: apiConfigOptions) {
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(apiConfig),
        createUserAgentMiddleware({
          libraryName: 'discount-code-importer',
          libraryVersion: version,
        }),
        createHttpMiddleware({ host: apiConfig.apiUrl }),
        createQueueMiddleware({}),
      ],
    })

    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
  }

  performStream (chunk: chunkOptions, cb: () => mixed) {
    this._processBatches(chunk)
      .then(() => cb())
      .catch(err => cb(err.body))
  }

  _processBatches () {
    return this
  }
}
