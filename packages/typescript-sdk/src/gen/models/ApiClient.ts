/* tslint:disable */
//Generated file, please do not change




export interface ApiClient {
  
  readonly id: string;
  
  readonly name: string;
  
  readonly scope: string;
  
  readonly createdAt?: string;
  
  readonly lastUsedAt?: string;
  
  readonly deleteAt?: string;
  
  readonly secret?: string
}

export interface ApiClientDraft {
  
  readonly name: string;
  
  readonly scope: string;
  
  readonly deleteDaysAfterCreation?: number
}

export interface ApiClientPagedQueryResponse {
  
  readonly count: number;
  
  readonly total?: number;
  
  readonly offset: number;
  
  readonly results: ApiClient[]
}