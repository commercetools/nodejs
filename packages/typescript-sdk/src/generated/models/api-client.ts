/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */

export interface ApiClient {
  /**
   *	The unique ID of the API client.
   *	This is the OAuth2 `client_id` and can be used to obtain a token.
   */
  readonly id: string
  readonly name: string
  /**
   *	A whitespace separated list of the OAuth scopes.
   *	This is the OAuth2 `scope` and can be used to obtain a token.
   */
  readonly scope: string
  readonly createdAt?: string
  /**
   *	The last day this API Client was used to obtain a token.
   */
  readonly lastUsedAt?: string
  /**
   *	If set, the client will be deleted on (or shortly after) this point in time.
   */
  readonly deleteAt?: string
  /**
   *	The secret is only shown once in the response of creating the API Client.
   *	This is the OAuth2 `client_secret` and can be used to obtain a token.
   */
  readonly secret?: string
}
export interface ApiClientDraft {
  readonly name: string
  readonly scope: string
  /**
   *	If set, the client will be deleted after the specified amount of days.
   */
  readonly deleteDaysAfterCreation?: number
}
export interface ApiClientPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ApiClient[]
}
