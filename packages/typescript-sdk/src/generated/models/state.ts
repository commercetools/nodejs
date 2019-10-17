//Generated file, please do not change

import {
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  LoggedResource,
  Reference,
  ReferenceTypeId,
  ResourceIdentifier,
} from './common'

export interface State extends LoggedResource {
  readonly key: string

  readonly type: StateTypeEnum

  readonly name?: LocalizedString

  readonly description?: LocalizedString

  readonly initial: boolean

  readonly builtIn: boolean

  readonly roles?: StateRoleEnum[]

  readonly transitions?: StateReference[]
}

export interface StateDraft {
  readonly key: string

  readonly type: StateTypeEnum

  readonly name?: LocalizedString

  readonly description?: LocalizedString

  readonly initial?: boolean

  readonly roles?: StateRoleEnum[]

  readonly transitions?: StateResourceIdentifier[]
}

export interface StatePagedQueryResponse {
  readonly limit: number

  readonly count: number

  readonly total?: number

  readonly offset: number

  readonly results: State[]
}

export interface StateReference {
  readonly typeId: 'state'

  readonly id: string

  readonly obj?: State
}

export interface StateResourceIdentifier {
  readonly typeId: 'state'

  readonly id?: string

  readonly key?: string
}

export type StateRoleEnum = 'ReviewIncludedInStatistics' | 'Return'

export type StateTypeEnum =
  | 'OrderState'
  | 'LineItemState'
  | 'ProductState'
  | 'ReviewState'
  | 'PaymentState'

export interface StateUpdate {
  readonly version: number

  readonly actions: StateUpdateAction[]
}

export type StateUpdateAction =
  | StateAddRolesAction
  | StateChangeInitialAction
  | StateChangeKeyAction
  | StateChangeTypeAction
  | StateRemoveRolesAction
  | StateSetDescriptionAction
  | StateSetNameAction
  | StateSetRolesAction
  | StateSetTransitionsAction

export interface StateAddRolesAction {
  readonly action: 'addRoles'

  readonly roles: StateRoleEnum[]
}

export interface StateChangeInitialAction {
  readonly action: 'changeInitial'

  readonly initial: boolean
}

export interface StateChangeKeyAction {
  readonly action: 'changeKey'

  readonly key: string
}

export interface StateChangeTypeAction {
  readonly action: 'changeType'

  readonly type: StateTypeEnum
}

export interface StateRemoveRolesAction {
  readonly action: 'removeRoles'

  readonly roles: StateRoleEnum[]
}

export interface StateSetDescriptionAction {
  readonly action: 'setDescription'

  readonly description: LocalizedString
}

export interface StateSetNameAction {
  readonly action: 'setName'

  readonly name: LocalizedString
}

export interface StateSetRolesAction {
  readonly action: 'setRoles'

  readonly roles: StateRoleEnum[]
}

export interface StateSetTransitionsAction {
  readonly action: 'setTransitions'

  readonly transitions?: StateResourceIdentifier[]
}
