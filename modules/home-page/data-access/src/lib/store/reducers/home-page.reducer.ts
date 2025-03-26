import {
  IChannelItem,
  IFormatStream,
  IMyChannelInfo,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState {
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
  videosInfo: Record<string, IFormatStream>;
  myChannelInfo: IMyChannelInfo | undefined;
}
export const initialHomePageState: IHomePageState = {
  videos: undefined,
  channelsInfo: {},
  videosInfo: {},
  myChannelInfo: undefined,
};

const reducer = createReducer(
  initialHomePageState,
  on(
    homePageActionGroup.loadYoutubePopularVideosSuccess,
    (state, { nextPage, videos, channelsInfo, videosInfo }) => ({
      ...state,
      videos: {
        ...videos,
        items: nextPage
          ? [...(state.videos?.items ?? []), ...videos.items]
          : videos.items,
      },
      channelsInfo: {
        ...state.channelsInfo,
        ...channelsInfo,
      },
      videosInfo: {
        ...state.videosInfo,
        ...videosInfo,
      },
    }),
  ),
  on(
    homePageActionGroup.loadMyChannelInfoSuccess,
    (state, { myChannelInfo }) => ({
      ...state,
      myChannelInfo: myChannelInfo,
    }),
  ),
);

export const {
  reducer: homePageReducer,
  selectHomePageState,
  selectVideos: selectHomePageVideos,
  selectChannelsInfo,
  selectVideosInfo,
  selectMyChannelInfo,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
