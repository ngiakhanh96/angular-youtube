import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { EventCreator, on, withReducer } from '@ngrx/signals/events';

import {
  HttpErrorResponseDetails,
  HttpResponse,
  HttpResponseStatus,
} from '../../../models/http-response/http-response.model';
import { IBaseState } from '../../../models/state';
import { sharedEventGroup } from '../actions/shared.event-group';
import { withSharedEffects } from '../effects/shared.effect.signal';
import { withHttpResponse } from '../selectors/base.computed';
import { initialSharedState, ISharedState } from './shared.reducer';

export const SharedStore = signalStore(
  withState<ISharedState>(initialSharedState),
  withSharedEffects(),
  withHttpResponse(),
  withSharedReducer(),
);

export function withSharedReducer() {
  return signalStoreFeature(
    { state: type<ISharedState>() },
    withReducer(
      on(
        sharedEventGroup.updateResponse,
        (
          {
            payload: {
              requestEventCreator,
              status,
              errorResponse,
              showSpinner,
            },
          },
          state,
        ) => ({
          httpResponse: updateResponseSignal(
            requestEventCreator,
            state,
            status,
            showSpinner,
            errorResponse,
          ),
        }),
      ),
      on(sharedEventGroup.getAccessTokenInfoSuccess, (event) => ({
        accessTokenInfo: event.payload.accessTokenInfo,
      })),
      on(sharedEventGroup.loadYoutubeVideoCategoriesSuccess, (event) => ({
        videoCategories: event.payload.videoCategories,
      })),
      on(sharedEventGroup.loadMyChannelInfoSuccess, (event) => ({
        myChannelInfo: event.payload.myChannelInfo,
      })),
    ),
  );
}

export function updateResponseSignal(
  eventCreator: EventCreator<string, any>,
  state: IBaseState,
  responseStatus: HttpResponseStatus,
  showSpinner: boolean,
  error?: HttpErrorResponseDetails,
): HttpResponse {
  const newPendingCount = showSpinner
    ? responseStatus === HttpResponseStatus.Pending
      ? state.httpResponse.details[eventCreator.type]?.status ===
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
        : eventCreator.type]: {
        status: responseStatus,
        errorResponse: error!,
      },
    },
  };
}
