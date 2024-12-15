import {
  IChannelItem,
  IFormatStream,
  IMyChannelInfo,
  IPopularYoutubeVideos,
  IVideoCategories,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState {
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
  videosInfo: Record<string, IFormatStream>;
  videoCategories: IVideoCategories | undefined;
  myChannelInfo: IMyChannelInfo | undefined;
}
export const initialHomePageState: IHomePageState = {
  videos: undefined,
  channelsInfo: {},
  videosInfo: {},
  videoCategories: undefined,
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
    homePageActionGroup.loadYoutubeVideoCategoriesSuccess,
    (state, { videoCategories }) => ({
      ...state,
      videoCategories: videoCategories,
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
  selectVideoCategories,
  selectMyChannelInfo,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
