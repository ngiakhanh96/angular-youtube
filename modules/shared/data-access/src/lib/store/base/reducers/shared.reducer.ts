import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { EventCreator, on, withReducer } from '@ngrx/signals/events';

import { IAccessTokenInfo } from '../../../models/http-response/auth.model';
import {
  HttpErrorResponseDetails,
  HttpResponse,
  HttpResponseStatus,
} from '../../../models/http-response/http-response.model';
import { IMyChannelInfo } from '../../../models/http-response/my-channel-info.model';
import { IVideoCategories } from '../../../models/http-response/video-categories-model';
import { withSharedEffects } from '../effects/shared.effect';
import { sharedEventGroup } from '../events/shared.event-group';
import { withSharedSelector } from '../selectors/shared.selector';

export interface IAccessTokenInfoState extends IAccessTokenInfo {
  expired_datetime: Date;
}

export interface ISharedState {
  accessTokenInfo: IAccessTokenInfoState | undefined;
  videoCategories: IVideoCategories | undefined;
  myChannelInfo: IMyChannelInfo | undefined;
  httpResponse: HttpResponse;
}

export const initialSharedState: ISharedState = {
  accessTokenInfo: undefined,
  videoCategories: undefined,
  myChannelInfo: undefined,
  httpResponse: {
    isPendingCount: 0,
    details: {},
  },
};

export const SharedStore = signalStore(
  withState<ISharedState>(initialSharedState),
  withSharedEffects(),
  withSharedSelector(),
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
  state: ISharedState,
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
