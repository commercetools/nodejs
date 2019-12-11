//Generated file, please do not change

import { CreatedBy, LastModifiedBy, LoggedResource, Reference } from './common'

export interface Extension extends LoggedResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  /**
   *	Present on resources updated after 1/02/2019 except for events not tracked.
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1/02/2019 except for events not tracked.
   */
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly destination: ExtensionDestination
  readonly triggers: ExtensionTrigger[]
  /**
   *	The maximum time the commercetools platform waits for a response from the extension.
   *	If not present, `2000` (2 seconds) is used.
   */
  readonly timeoutInMs?: number
}
export type ExtensionAction = 'Create' | 'Update'
export type ExtensionDestination =
  | ExtensionHttpDestination
  | ExtensionAWSLambdaDestination
export interface ExtensionAWSLambdaDestination {
  readonly type: 'AWSLambda'
  readonly accessKey: string
  readonly arn: string
  readonly accessSecret: string
}
export interface ExtensionDraft {
  /**
   *	User-specific unique identifier for the extension
   */
  readonly key?: string
  /**
   *	Details where the extension can be reached
   */
  readonly destination: ExtensionDestination
  /**
   *	Describes what triggers the extension
   */
  readonly triggers: ExtensionTrigger[]
  /**
   *	The maximum time the commercetools platform waits for a response from the extension.
   *	The maximum value is 2000 ms (2 seconds).
   *	This limit can be increased per project after we review the performance impact.
   *	Please contact Support via the [Support Portal](https://support.commercetools.com) and provide the region, project key and use case.
   */
  readonly timeoutInMs?: number
}
export interface ExtensionHttpDestination {
  readonly type: 'HTTP'
  readonly url: string
  readonly authentication?: ExtensionHttpDestinationAuthentication
}
export type ExtensionHttpDestinationAuthentication =
  | ExtensionAuthorizationHeaderAuthentication
  | ExtensionAzureFunctionsAuthentication
export interface ExtensionAuthorizationHeaderAuthentication {
  readonly type: 'AuthorizationHeader'
  readonly headerValue: string
}
export interface ExtensionAzureFunctionsAuthentication {
  readonly type: 'AzureFunctions'
  readonly key: string
}
export interface ExtensionInput {
  readonly action: ExtensionAction
  readonly resource: Reference
}
export interface ExtensionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Extension[]
}
export type ExtensionResourceTypeId = 'cart' | 'order' | 'payment' | 'customer'
export interface ExtensionTrigger {
  readonly resourceTypeId: ExtensionResourceTypeId
  readonly actions: ExtensionAction[]
}
export interface ExtensionUpdate {
  readonly version: number
  readonly actions: ExtensionUpdateAction[]
}
export type ExtensionUpdateAction =
  | ExtensionChangeDestinationAction
  | ExtensionChangeTriggersAction
  | ExtensionSetKeyAction
  | ExtensionSetTimeoutInMsAction
export interface ExtensionChangeDestinationAction {
  readonly action: 'changeDestination'
  readonly destination: ExtensionDestination
}
export interface ExtensionChangeTriggersAction {
  readonly action: 'changeTriggers'
  readonly triggers: ExtensionTrigger[]
}
export interface ExtensionSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface ExtensionSetTimeoutInMsAction {
  readonly action: 'setTimeoutInMs'
  /**
   *	The maximum time the commercetools platform waits for a response from the extension.
   *	The maximum value is 2000 ms (2 seconds).
   *	This limit can be increased per project after we review the performance impact.
   *	Please contact Support via the support and provide the region, project key and use case.
   */
  readonly timeoutInMs?: number
}
