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
import { IBaseState } from '../../../models/state.model';
import { BaseActionGroup } from '../actions/base.action-group';

export const initialBaseState: IBaseState = {
  httpResponse: {
    isPendingCount: 0,
    details: {},
  },
};

export function updateResponse(
  action: ActionCreator<string, Creator>,
  state: IBaseState,
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
  TState extends Required<IBaseState>
>(
  actionGroup: TActionsGroup,
  initialState: TState,
  ...ons: Parameters<
    typeof createReducer<TState, Action, ActionReducer<TState, Action>>
  >[1][]
) {
  return createReducer<TState, Action<string>, ActionReducer<TState>>(
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
