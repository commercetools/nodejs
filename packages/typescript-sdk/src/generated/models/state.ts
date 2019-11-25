//Generated file, please do not change

import { CreatedBy, LastModifiedBy, LocalizedString, LoggedResource, Reference, ReferenceTypeId, ResourceIdentifier } from './common'

export interface State extends LoggedResource {
  readonly id: string;
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  /**
  *		Present on resources updated after 1/02/2019 except for events not tracked.
  */
  readonly lastModifiedBy?: LastModifiedBy;
  /**
  *		Present on resources created after 1/02/2019 except for events not tracked.
  */
  readonly createdBy?: CreatedBy;
  /**
  *		A unique identifier for the state.
  */
  readonly key: string;
  readonly type: StateTypeEnum;
  /**
  *		A human-readable name of the state.
  */
  readonly name?: LocalizedString;
  /**
  *		A human-readable description of the state.
  */
  readonly description?: LocalizedString;
  /**
  *		A state can be declared as an initial state for any state machine.
  *		When a workflow starts, this first state must be an `initial` state.
  */
  readonly initial: boolean;
  /**
  *		Builtin states are integral parts of the project that cannot be deleted nor the key can be changed.
  */
  readonly builtIn: boolean;
  readonly roles?: StateRoleEnum[];
  /**
  *		Transitions are a way to describe possible transformations of the current state to other states of the same `type` (e.g.: _Initial_ -> _Shipped_).
  *		When performing a `transitionState` update action and `transitions` is set, the currently referenced state must have a transition to the new state.
  *		If `transitions` is an empty list, it means the current state is a final state and no further transitions are allowed.
  *		If `transitions` is not set, the validation is turned off.
  *		When performing a `transitionState` update action, any other state of the same `type` can be transitioned to.
  */
  readonly transitions?: StateReference[]
}
export interface StateDraft {
  readonly key: string;
  readonly type: StateTypeEnum;
  readonly name?: LocalizedString;
  readonly description?: LocalizedString;
  readonly initial?: boolean;
  readonly roles?: StateRoleEnum[];
  readonly transitions?: StateResourceIdentifier[]
}
export interface StatePagedQueryResponse {
  readonly limit: number;
  readonly count: number;
  readonly total?: number;
  readonly offset: number;
  readonly results: State[]
}
export interface StateReference {
  readonly typeId: "state";
  readonly id: string;
  readonly obj?: State
}
export interface StateResourceIdentifier {
  readonly typeId: "state";
  readonly id?: string;
  readonly key?: string
}
export type StateRoleEnum =
   'ReviewIncludedInStatistics' |
   'Return';
export type StateTypeEnum =
   'OrderState' |
   'LineItemState' |
   'ProductState' |
   'ReviewState' |
   'PaymentState';
export interface StateUpdate {
  readonly version: number;
  readonly actions: StateUpdateAction[]
}
export type StateUpdateAction =
  StateAddRolesAction |
  StateChangeInitialAction |
  StateChangeKeyAction |
  StateChangeTypeAction |
  StateRemoveRolesAction |
  StateSetDescriptionAction |
  StateSetNameAction |
  StateSetRolesAction |
  StateSetTransitionsAction
;
export interface StateAddRolesAction {
  readonly action: "addRoles";
  readonly roles: StateRoleEnum[]
}
export interface StateChangeInitialAction {
  readonly action: "changeInitial";
  readonly initial: boolean
}
export interface StateChangeKeyAction {
  readonly action: "changeKey";
  readonly key: string
}
export interface StateChangeTypeAction {
  readonly action: "changeType";
  readonly type: StateTypeEnum
}
export interface StateRemoveRolesAction {
  readonly action: "removeRoles";
  readonly roles: StateRoleEnum[]
}
export interface StateSetDescriptionAction {
  readonly action: "setDescription";
  readonly description: LocalizedString
}
export interface StateSetNameAction {
  readonly action: "setName";
  readonly name: LocalizedString
}
export interface StateSetRolesAction {
  readonly action: "setRoles";
  readonly roles: StateRoleEnum[]
}
export interface StateSetTransitionsAction {
  readonly action: "setTransitions";
  readonly transitions?: StateResourceIdentifier[]
}