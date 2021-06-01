export enum GenericStoreStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
  Loading = 'loading',
}

export interface GenericState<TData, TStatus> {
  data: TData | null;
  status: TStatus;
  error: string | null;
}
