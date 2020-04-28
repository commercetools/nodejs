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

import {
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  Reference,
} from 'models/common'
import { UserProvidedIdentifiers } from 'models/message'

export interface ChangeSubscription {
  readonly resourceTypeId: string
}
export type DeliveryFormat = DeliveryPlatformFormat | DeliveryCloudEventsFormat
export interface DeliveryCloudEventsFormat {
  readonly type: 'CloudEvents'
  readonly cloudEventsVersion: string
}
export interface DeliveryPlatformFormat {
  readonly type: 'Platform'
}
export type Destination =
  | GoogleCloudPubSubDestination
  | IronMqDestination
  | SnsDestination
  | SqsDestination
  | AzureServiceBusDestination
  | AzureEventGridDestination
export interface AzureEventGridDestination {
  readonly type: 'EventGrid'
  readonly uri: string
  readonly accessKey: string
}
export interface AzureServiceBusDestination {
  readonly type: 'AzureServiceBus'
  readonly connectionString: string
}
export interface GoogleCloudPubSubDestination {
  readonly type: 'GoogleCloudPubSub'
  readonly projectId: string
  readonly topic: string
}
export interface IronMqDestination {
  readonly type: 'IronMQ'
  readonly uri: string
}
export interface MessageSubscription {
  readonly resourceTypeId: string
  readonly types?: string[]
}
export interface PayloadNotIncluded {
  readonly reason: string
  readonly payloadType: string
}
export interface SnsDestination {
  readonly type: 'SNS'
  readonly accessKey: string
  readonly accessSecret: string
  readonly topicArn: string
}
export interface SqsDestination {
  readonly type: 'SQS'
  readonly accessKey: string
  readonly accessSecret: string
  readonly queueUrl: string
  readonly region: string
}
export interface Subscription extends BaseResource {
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
  readonly changes: ChangeSubscription[]
  readonly destination: Destination
  readonly key?: string
  readonly messages: MessageSubscription[]
  readonly format: DeliveryFormat
  readonly status: SubscriptionHealthStatus
}
export type SubscriptionDelivery =
  | ResourceUpdatedDelivery
  | ResourceCreatedDelivery
  | ResourceDeletedDelivery
  | MessageDelivery
export interface MessageDelivery {
  readonly notificationType: 'Message'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly sequenceNumber: number
  readonly resourceVersion: number
  readonly payloadNotIncluded: PayloadNotIncluded
}
export interface ResourceCreatedDelivery {
  readonly notificationType: 'ResourceCreated'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly modifiedAt: string
}
export interface ResourceDeletedDelivery {
  readonly notificationType: 'ResourceDeleted'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly modifiedAt: string
}
export interface ResourceUpdatedDelivery {
  readonly notificationType: 'ResourceUpdated'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly oldVersion: number
  readonly modifiedAt: string
}
export interface SubscriptionDraft {
  readonly changes?: ChangeSubscription[]
  readonly destination: Destination
  readonly key?: string
  readonly messages?: MessageSubscription[]
  readonly format?: DeliveryFormat
}
export type SubscriptionHealthStatus =
  | 'Healthy'
  | 'ConfigurationError'
  | 'ConfigurationErrorDeliveryStopped'
  | 'TemporaryError'
export interface SubscriptionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Subscription[]
}
export interface SubscriptionUpdate {
  readonly version: number
  readonly actions: SubscriptionUpdateAction[]
}
export type SubscriptionUpdateAction =
  | SubscriptionChangeDestinationAction
  | SubscriptionSetChangesAction
  | SubscriptionSetKeyAction
  | SubscriptionSetMessagesAction
export interface SubscriptionChangeDestinationAction {
  readonly action: 'changeDestination'
  readonly destination: Destination
}
export interface SubscriptionSetChangesAction {
  readonly action: 'setChanges'
  readonly changes?: ChangeSubscription[]
}
export interface SubscriptionSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, this field will be removed if it exists.
   */
  readonly key?: string
}
export interface SubscriptionSetMessagesAction {
  readonly action: 'setMessages'
  readonly messages?: MessageSubscription[]
}
