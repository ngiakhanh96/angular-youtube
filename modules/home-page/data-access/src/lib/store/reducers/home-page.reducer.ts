import {
  createAyReducer,
  IBaseState,
  initialBaseState,
  IYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createFeature, on } from '@ngrx/store';
import { homePageActionGroup } from '../actions/home-page.action-group';

export const homePageStateName = 'homePage';
export interface IHomePageState extends IBaseState {
  nextPageToken: string | undefined;
  videos: IYoutubeVideos | undefined;
}
export const initialHomePageState: IHomePageState = {
  ...initialBaseState,
  nextPageToken: undefined,
  videos: undefined,
};

const reducer = createAyReducer(
  homePageActionGroup,
  initialHomePageState,
  on(
    homePageActionGroup.loadYoutubePopularVideosSuccess,
    (state, { nextPage, videos }) => ({
      ...state,
      videos: {
        ...videos,
        items: nextPage
          ? [...(state.videos?.items ?? []), ...videos.items]
          : state.videos?.items ?? [],
      },
    })
  )
);

export const {
  reducer: homePageReducer,
  selectHomePageState,
  selectHttpResponse: selectHomePageHttpResponse,
} = createFeature<string, IHomePageState>({
  name: homePageStateName,
  reducer: reducer,
});
