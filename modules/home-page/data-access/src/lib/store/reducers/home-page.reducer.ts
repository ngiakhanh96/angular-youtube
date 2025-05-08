import {
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState {
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
  videosInfo: Record<string, IFormatStream>;
}
export const initialHomePageState: IHomePageState = {
  videos: undefined,
  channelsInfo: {},
  videosInfo: {},
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
);

export const {
  reducer: homePageReducer,
  selectHomePageState,
  selectVideos: selectHomePageVideos,
  selectChannelsInfo,
  selectVideosInfo,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
