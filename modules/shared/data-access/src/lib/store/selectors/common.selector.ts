import { BaseState } from '../models/state.model';

export const getResponse = (state: BaseState) => state.httpResponse;
export const getResponseDetails = (state: BaseState, actionType: string) =>
  state.httpResponse.details[actionType];
