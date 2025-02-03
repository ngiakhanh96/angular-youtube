import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export const detailsPageStateName = 'detailsPage';

export interface IDetailsPageState {
  videoInfo: IInvidiousVideoInfo | undefined;
  recommendedVideosInfo: IInvidiousVideoInfo[];
}
export const initialDetailsPageState: IDetailsPageState = {
  videoInfo: undefined,
  recommendedVideosInfo: [],
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
);

export const {
  reducer: detailsPageReducer,
  selectDetailsPageState,
  selectVideoInfo: selectDetailsPageVideoInfo,
  selectRecommendedVideosInfo: selectDetailsPageRecommendedVideosInfo,
} = createFeature<string, IDetailsPageState>({
  name: detailsPageStateName,
  reducer: reducer,
});
