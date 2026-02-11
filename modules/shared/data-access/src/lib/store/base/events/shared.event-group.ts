import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IMyChannelInfo } from '../../../models/http-response/my-channel-info.model';
import { IVideoCategories } from '../../../models/http-response/video-categories-model';
import { IAccessTokenInfoState } from '../reducers/shared.reducer';
import {
  CancelRequestEvent,
  SendingRequestEvent,
  UpdateResponseEvent,
} from './shared.event';

export const sharedEventGroup = eventGroup({
  source: 'Shared',
  events: {
    updateResponse: type<UpdateResponseEvent>(),
    sendingRequest: type<SendingRequestEvent>(),
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
