/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { LoggedResource } from './Common'
import { Reference } from './Common'
import { UserProvidedIdentifiers } from './Message'


export interface ChangeSubscription {
  
  readonly resourceTypeId: string
}

export type DeliveryFormat =
  DeliveryPlatformFormat |
  DeliveryCloudEventsFormat
;

export interface DeliveryCloudEventsFormat {
  readonly type: "CloudEvents";
  
  readonly cloudEventsVersion: string
}

export interface DeliveryPlatformFormat {
  readonly type: "Platform";
}

export type Destination =
  GoogleCloudPubSubDestination |
  IronMqDestination |
  SnsDestination |
  SqsDestination |
  AzureEventGridDestination |
  AzureServiceBusDestination
;

export interface AzureEventGridDestination {
  readonly type: "EventGrid";
  
  readonly accessKey: string;
  
  readonly uri: string
}

export interface AzureServiceBusDestination {
  readonly type: "AzureServiceBus";
  
  readonly connectionString: string
}

export interface GoogleCloudPubSubDestination {
  readonly type: "GoogleCloudPubSub";
  
  readonly topic: string;
  
  readonly projectId: string
}

export interface IronMqDestination {
  readonly type: "IronMQ";
  
  readonly uri: string
}

export interface MessageSubscription {
  
  readonly resourceTypeId: string;
  
  readonly types?: string[]
}

export interface PayloadNotIncluded {
  
  readonly reason: string;
  
  readonly payloadType: string
}

export interface SnsDestination {
  readonly type: "SNS";
  
  readonly accessKey: string;
  
  readonly topicArn: string;
  
  readonly accessSecret: string
}

export interface SqsDestination {
  readonly type: "SQS";
  
  readonly accessKey: string;
  
  readonly queueUrl: string;
  
  readonly region: string;
  
  readonly accessSecret: string
}

export interface Subscription extends LoggedResource {
  
  readonly changes: ChangeSubscription[];
  
  readonly destination: Destination;
  
  readonly key?: string;
  
  readonly messages: MessageSubscription[];
  
  readonly format: DeliveryFormat;
  
  readonly status: SubscriptionHealthStatus
}

export type SubscriptionDelivery =
  MessageDelivery |
  ResourceCreatedDelivery |
  ResourceDeletedDelivery |
  ResourceUpdatedDelivery
;

export interface MessageDelivery {
  readonly notificationType: "Message";
  
  readonly projectKey: string;
  
  readonly resource: Reference;
  
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers;
  
  readonly sequenceNumber: number;
  
  readonly createdAt: string;
  
  readonly lastModifiedAt: string;
  
  readonly resourceVersion: number;
  
  readonly payloadNotIncluded: PayloadNotIncluded;
  
  readonly id: string;
  
  readonly version: number
}

export interface ResourceCreatedDelivery {
  readonly notificationType: "ResourceCreated";
  
  readonly projectKey: string;
  
  readonly resource: Reference;
  
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers;
  
  readonly modifiedAt: string;
  
  readonly version: number
}

export interface ResourceDeletedDelivery {
  readonly notificationType: "ResourceDeleted";
  
  readonly projectKey: string;
  
  readonly resource: Reference;
  
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers;
  
  readonly modifiedAt: string;
  
  readonly version: number
}

export interface ResourceUpdatedDelivery {
  readonly notificationType: "ResourceUpdated";
  
  readonly projectKey: string;
  
  readonly resource: Reference;
  
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers;
  
  readonly modifiedAt: string;
  
  readonly oldVersion: number;
  
  readonly version: number
}

export interface SubscriptionDraft {
  
  readonly changes?: ChangeSubscription[];
  
  readonly destination: Destination;
  
  readonly key?: string;
  
  readonly messages?: MessageSubscription[];
  
  readonly format?: DeliveryFormat
}

export type SubscriptionHealthStatus =
   'Healthy' |
   'ConfigurationError' |
   'ConfigurationErrorDeliveryStopped' |
   'TemporaryError';

export interface SubscriptionPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Subscription[]
}

export interface SubscriptionUpdate {
  
  readonly version: number;
  
  readonly actions: SubscriptionUpdateAction[]
}

export type SubscriptionUpdateAction =
  SubscriptionChangeDestinationAction |
  SubscriptionSetChangesAction |
  SubscriptionSetKeyAction |
  SubscriptionSetMessagesAction
;

export interface SubscriptionChangeDestinationAction {
  readonly action: "changeDestination";
  
  readonly destination: Destination
}

export interface SubscriptionSetChangesAction {
  readonly action: "setChanges";
  
  readonly changes?: ChangeSubscription[]
}

export interface SubscriptionSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface SubscriptionSetMessagesAction {
  readonly action: "setMessages";
  
  readonly messages?: MessageSubscription[]
}