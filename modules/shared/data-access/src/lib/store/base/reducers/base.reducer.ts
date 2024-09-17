import {
  Action,
  ActionCreator,
  ActionReducer,
  createReducer,
  Creator,
  on,
} from '@ngrx/store';
import {
  HttpErrorResponseDetails,
  HttpResponse,
  HttpResponseStatus,
} from '../../../models/http-response.model';
import { BaseState } from '../../../models/state.model';
import { BaseActionGroup } from '../actions/base.action-group';

const initialCommonState: BaseState = {
  httpResponse: {
    isPendingCount: 0,
    details: {},
  },
};

export function updateResponse(
  action: ActionCreator<string, Creator>,
  state: BaseState,
  responseStatus: HttpResponseStatus,
  showSpinner: boolean,
  error?: HttpErrorResponseDetails
): HttpResponse {
  const newPendingCount = showSpinner
    ? responseStatus === HttpResponseStatus.Pending
      ? state.httpResponse.details[action.type]?.status ===
        HttpResponseStatus.Pending
        ? state.httpResponse.isPendingCount
        : state.httpResponse.isPendingCount + 1
      : state.httpResponse.isPendingCount - 1
    : state.httpResponse.isPendingCount;

  return {
    isPendingCount: newPendingCount,
    details: {
      ...state.httpResponse.details,
      [responseStatus === HttpResponseStatus.Error
        ? error!.actionName
        : action.type]: {
        status: responseStatus,
        errorResponse: error!,
      },
    },
  };
}

export function createAyReducer<
  TActionsGroup extends BaseActionGroup,
  TState extends BaseState
>(
  actionGroup: TActionsGroup,
  initialState: TState,
  ...ons: Parameters<
    typeof createReducer<TState, Action, ActionReducer<TState, Action>>
  >[1][]
) {
  return createReducer(
    initialState,
    on(
      actionGroup.updateResponse,
      (
        state,
        { requestActionCreator, status, errorResponse, showSpinner }
      ) => ({
        ...state,
        httpResponse: updateResponse(
          requestActionCreator,
          state,
          status,
          showSpinner,
          errorResponse
        ),
      })
    ),
    ...ons
  );
}
