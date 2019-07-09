/* tslint:disable */
//Generated file, please do not change

import { CreatedBy } from './Common'
import { LastModifiedBy } from './Common'
import { LoggedResource } from './Common'
import { Reference } from './Common'


export interface Extension extends LoggedResource {
  
  readonly key?: string;
  
  readonly destination: ExtensionDestination;
  
  readonly triggers: ExtensionTrigger[];
  
  readonly timeoutInMs?: number
}

export type ExtensionAction =
   'Create' |
   'Update';

export type ExtensionDestination =
  ExtensionHttpDestination |
  ExtensionAWSLambdaDestination
;

export interface ExtensionAWSLambdaDestination {
  readonly type: "AWSLambda";
  
  readonly accessKey: string;
  
  readonly arn: string;
  
  readonly accessSecret: string
}

export interface ExtensionDraft {
  
  readonly key?: string;
  
  readonly destination: ExtensionDestination;
  
  readonly triggers: ExtensionTrigger[];
  
  readonly timeoutInMs?: number
}

export interface ExtensionHttpDestination {
  readonly type: "HTTP";
  
  readonly url: string;
  
  readonly authentication?: ExtensionHttpDestinationAuthentication
}

export type ExtensionHttpDestinationAuthentication =
  ExtensionAuthorizationHeaderAuthentication |
  ExtensionAzureFunctionsAuthentication
;

export interface ExtensionAuthorizationHeaderAuthentication {
  readonly type: "AuthorizationHeader";
  
  readonly headerValue: string
}

export interface ExtensionAzureFunctionsAuthentication {
  readonly type: "AzureFunctions";
  
  readonly key: string
}

export interface ExtensionInput {
  
  readonly action: ExtensionAction;
  
  readonly resource: Reference
}

export interface ExtensionPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: Extension[]
}

export type ExtensionResourceTypeId =
   'cart' |
   'order' |
   'payment' |
   'customer';

export interface ExtensionTrigger {
  
  readonly resourceTypeId: ExtensionResourceTypeId;
  
  readonly actions: ExtensionAction[]
}

export interface ExtensionUpdate {
  
  readonly version: number;
  
  readonly actions: ExtensionUpdateAction[]
}

export type ExtensionUpdateAction =
  ExtensionChangeDestinationAction |
  ExtensionChangeTriggersAction |
  ExtensionSetKeyAction |
  ExtensionSetTimeoutInMsAction
;

export interface ExtensionChangeDestinationAction {
  readonly action: "changeDestination";
  
  readonly destination: ExtensionDestination
}

export interface ExtensionChangeTriggersAction {
  readonly action: "changeTriggers";
  
  readonly triggers: ExtensionTrigger[]
}

export interface ExtensionSetKeyAction {
  readonly action: "setKey";
  
  readonly key?: string
}

export interface ExtensionSetTimeoutInMsAction {
  readonly action: "setTimeoutInMs";
  
  readonly timeoutInMs?: number
}