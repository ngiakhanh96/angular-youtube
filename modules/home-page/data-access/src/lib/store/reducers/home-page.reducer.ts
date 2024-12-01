import {
  createAyReducer,
  IBaseState,
  IChannelItem,
  IMyChannelInfo,
  initialBaseState,
  IPopularYoutubeVideos,
  IVideoCategories,
} from '@angular-youtube/shared-data-access';
import { createFeature, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState extends IBaseState {
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

const reducer = createAyReducer(
  homePageActionGroup,
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
  selectHttpResponse: selectHomePageHttpResponse,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
