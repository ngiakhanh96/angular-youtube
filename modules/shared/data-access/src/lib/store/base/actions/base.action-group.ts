import {
  Action,
  ActionCreator,
  ActionCreatorProps,
  createActionGroup,
  Creator,
  props,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  HttpErrorResponseDetails,
  HttpResponseStatus,
} from '../../../models/http-response/http-response.model';
import { IBaseState } from '../../../models/state';

export function createAyActionGroup<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>,
>(config: Parameters<typeof createActionGroup<Source, Events>>[0]) {
  const baseActionGroupEvents: BaseActionGroupEvents = {
    updateResponse: props<UpdateResponseAction>(),
    sendingRequest: props<SendingRequestAction>(),
    sendingRequestWithState: props<SendingRequestAction>(),
    cancelRequest: props<CancelRequestAction>(),
  };

  const events = {
    ...baseActionGroupEvents,
    ...config.events,
  };
  return createActionGroup<Source, typeof events>({
    source: config.source,
    events,
  });
}

export interface UpdateResponseAction {
  requestActionCreator: ActionCreator<string, Creator<unknown[], Action>>;
  status: HttpResponseStatus;
  errorResponse?: HttpErrorResponseDetails;
  showSpinner: boolean;
}

export interface SendingRequestAction {
  requestActionCreator: ActionCreator<string, Creator<any[], Action>>;
  requestAction: Action;
  requestActionCallback?: (action: Action) => Observable<Action>;
  requestActionCallBackWithState?: (
    actionWithState: [Action, IBaseState],
  ) => Observable<Action>;
  showSpinner: boolean;
  actionForSuccessfulResponse: ActionForSuccessfulResponse;
  observableFactory?: (value: Action) => Observable<unknown>;
}

export interface CancelRequestAction {
  requestActionCreator: ActionCreator<string, Creator<unknown[], Action>>;
}

export type AyActionCreator<T> = ActionCreator<
  string,
  Creator<T[], T & Action>
>;
export interface BaseActions {
  updateResponse: UpdateResponseAction;
  sendingRequest: SendingRequestAction;
  sendingRequestWithState: SendingRequestAction;
  cancelRequest: CancelRequestAction;
}

export type BaseActionGroup = {
  [key in keyof BaseActions]: AyActionCreator<BaseActions[key]>;
};

export type BaseActionGroupEvents = {
  [key in keyof BaseActions]: ActionCreatorProps<BaseActions[key]>;
};

export enum ActionForSuccessfulResponse {
  UpdateResponseAndHideSpinner = 'UpdateResponseAndHideSpinner',
  DoNothing = 'DoNothing',
}
