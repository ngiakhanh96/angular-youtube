import { type } from '@ngrx/signals';
import { EventCreator, eventGroup, EventInstance } from '@ngrx/signals/events';
import { Observable } from 'rxjs';
import {
  HttpErrorResponseDetails,
  HttpResponseStatus,
} from '../../../models/http-response/http-response.model';
import { IMyChannelInfo } from '../../../models/http-response/my-channel-info.model';
import { IVideoCategories } from '../../../models/http-response/video-categories-model';
import { IBaseState } from '../../../models/state';
import { IAccessTokenInfoState } from '../reducers/shared.reducer';

export const sharedEventGroup = eventGroup({
  source: 'Shared',
  events: {
    updateResponse: type<UpdateResponseEvent>(),
    sendingRequest: type<SendingRequestEvent>(),
    sendingRequestWithState: type<SendingRequestEvent>(),
    cancelRequest: type<CancelRequestEvent>(),
    updateAccessToken: type<{ accessToken: string | null }>(),
    updateAccessTokenSuccess: type<{ accessToken: string }>(),
    getAccessTokenInfo: type<{ accessToken: string }>(),
    getAccessTokenInfoSuccess: type<{
      accessToken: string;
      accessTokenInfo: IAccessTokenInfoState;
    }>(),
    signOut: type<void>(),
    refreshAccessToken: type<void>(),
    loadYoutubeVideoCategories: type<void>(),
    loadYoutubeVideoCategoriesSuccess: type<{
      videoCategories: IVideoCategories;
    }>(),
    loadMyChannelInfo: type<void>(),
    loadMyChannelInfoSuccess: type<{ myChannelInfo: IMyChannelInfo }>(),
    empty: type<void>(),
  },
});

export interface UpdateResponseEvent {
  requestEventCreator: EventCreator<string, any>;
  status: HttpResponseStatus;
  errorResponse?: HttpErrorResponseDetails;
  showSpinner: boolean;
}

export interface SendingRequestEvent {
  requestEventCreator: EventCreator<string, any>;
  requestEvent: EventInstance<string, any>;
  requestEventCallback?: (
    event: EventInstance<string, any>,
  ) => Observable<EventInstance<string, any>>;
  requestEventCallBackWithState?: (
    eventWithState: [EventInstance<string, any>, IBaseState],
  ) => Observable<EventInstance<string, any>>;
  showSpinner: boolean;
  eventForSuccessfulResponse: EventForSuccessfulResponse;
  observableFactory?: (
    value: EventInstance<string, any>,
  ) => Observable<unknown>;
}

export interface CancelRequestEvent {
  requestEventCreator: EventCreator<string, any>;
}

export enum EventForSuccessfulResponse {
  UpdateResponseAndHideSpinner = 'UpdateResponseAndHideSpinner',
  DoNothing = 'DoNothing',
}
