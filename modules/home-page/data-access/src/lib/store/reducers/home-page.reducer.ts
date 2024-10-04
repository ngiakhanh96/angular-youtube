import {
  createAyReducer,
  IBaseState,
  IChannelItem,
  initialBaseState,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createFeature, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';

export interface IHomePageState extends IBaseState {
  nextPageToken: string | undefined;
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
}
export const initialHomePageState: IHomePageState = {
  ...initialBaseState,
  nextPageToken: undefined,
  videos: undefined,
  channelsInfo: {},
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
    })
  )
);

export const {
  reducer: homePageReducer,
  selectHomePageState,
  selectNextPageToken: selectHomePageNextPageToken,
  selectVideos: selectHomePageVideos,
  selectChannelsInfo: selectHomePageChannelsInfo,
  selectHttpResponse: selectHomePageHttpResponse,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
