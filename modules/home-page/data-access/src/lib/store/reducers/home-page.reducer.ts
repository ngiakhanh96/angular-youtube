import {
  IChannelItem,
  IMyChannelInfo,
  initialBaseState,
  IPopularYoutubeVideos,
  IVideoCategories,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState {
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
  videoCategories: IVideoCategories | undefined;
  myChannelInfo: IMyChannelInfo | undefined;
}
export const initialHomePageState: IHomePageState = {
  ...initialBaseState,
  videos: undefined,
  channelsInfo: {},
  videoCategories: undefined,
  myChannelInfo: undefined,
};

const reducer = createReducer(
  initialHomePageState,
  on(
    homePageActionGroup.loadYoutubePopularVideosSuccess,
    (state, { nextPage, videos, channelsInfo }) => ({
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
  selectVideoCategories,
  selectMyChannelInfo,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
