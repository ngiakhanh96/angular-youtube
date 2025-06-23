import { IBaseState } from '../../../models/state';

export const getResponse = (state: IBaseState) => state.httpResponse;
export const getResponseDetails = (state: IBaseState, actionType: string) =>
  state.httpResponse.details[actionType];
