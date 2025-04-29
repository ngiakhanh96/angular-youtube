import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export const detailsPageStateName = 'detailsPage';

export interface IDetailsPageState {
  videoInfo: IInvidiousVideoInfo | undefined;
  recommendedVideosInfo: IInvidiousVideoInfo[];
  videoCommentsInfo: IInvidiousVideoCommentsInfo | undefined;
}
export const initialDetailsPageState: IDetailsPageState = {
  videoInfo: undefined,
  recommendedVideosInfo: [],
  videoCommentsInfo: undefined,
};

const reducer = createReducer(
  initialDetailsPageState,
  on(
    detailsPageActionGroup.loadYoutubeVideoSuccess,
    (state, { videoInfo, recommendedVideosInfo }) => ({
      ...state,
      videoInfo: videoInfo,
      recommendedVideosInfo: recommendedVideosInfo,
    }),
  ),
  on(
    detailsPageActionGroup.loadYoutubeVideoCommentsSuccess,
    (state, { commentsInfo }) => ({
      ...state,
      videoCommentsInfo: commentsInfo,
    }),
  ),
  on(detailsPageActionGroup.reset, () => initialDetailsPageState),
);

export const {
  reducer: detailsPageReducer,
  selectDetailsPageState,
  selectVideoInfo: selectDetailsPageVideoInfo,
  selectRecommendedVideosInfo: selectDetailsPageRecommendedVideosInfo,
  selectVideoCommentsInfo: selectDetailsPageVideoCommentsInfo,
} = createFeature<string, IDetailsPageState>({
  name: detailsPageStateName,
  reducer: reducer,
});
