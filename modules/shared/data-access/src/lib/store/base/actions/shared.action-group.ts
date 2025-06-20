import { emptyProps, props } from '@ngrx/store';
import { IMyChannelInfo } from '../../../models/http-response/my-channel-info.model';
import { IVideoCategories } from '../../../models/http-response/video-categories-model';
import { createAyActionGroup } from '../../base/actions/base.action-group';
import { IAccessTokenInfoState } from '../reducers/shared.reducer';

export const sharedActionGroup = createAyActionGroup({
  source: 'Shared',
  events: {
    updateAccessToken: props<{ accessToken: string | null }>(),
    updateAccessTokenSuccess: props<{ accessToken: string }>(),
    getAccessTokenInfo: props<{ accessToken: string }>(),
    getAccessTokenInfoSuccess: props<{
      accessToken: string;
      accessTokenInfo: IAccessTokenInfoState;
    }>(),
    signOut: emptyProps(),
    refreshAccessToken: emptyProps(),
    loadYoutubeVideoCategories: emptyProps(),
    loadYoutubeVideoCategoriesSuccess: props<{
      videoCategories: IVideoCategories;
    }>(),
    loadMyChannelInfo: emptyProps(),
    loadMyChannelInfoSuccess: props<{ myChannelInfo: IMyChannelInfo }>(),
    empty: emptyProps(),
  },
});
