import type { AuthMiddlewareOptions, TokenCacheOptions } from 'types/sdk'

export default function buildTokenCacheKey(
  options: AuthMiddlewareOptions
): TokenCacheOptions {
  return {
    clientId: options.credentials.clientId,
    host: options.host,
    projectKey: options.projectKey,
  }
}
