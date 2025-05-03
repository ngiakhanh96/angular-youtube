import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
} from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export const detailsPageStateName = 'detailsPage';

export interface IDetailsPageState {
  videoInfo: IInvidiousVideoInfo | undefined;
  recommendedVideosInfo: IInvidiousVideoInfo[];
  videoCommentsInfo: IInvidiousVideoCommentsInfo | undefined;
  nestedVideoCommentsInfo: Record<string, IInvidiousVideoCommentsInfo>;
}
export const initialDetailsPageState: IDetailsPageState = {
  videoInfo: undefined,
  recommendedVideosInfo: [],
  videoCommentsInfo: undefined,
  nestedVideoCommentsInfo: {},
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
    (state, { commentsInfo, commentId, continuation }) => ({
      ...state,
      videoCommentsInfo: commentId
        ? state.videoCommentsInfo
        : continuation
          ? {
              ...(state.videoCommentsInfo ?? commentsInfo),
              comments: [
                ...(state.videoCommentsInfo?.comments ?? []),
                ...commentsInfo.comments,
              ],
              continuation: commentsInfo.continuation,
            }
          : commentsInfo,
      nestedVideoCommentsInfo: commentId
        ? {
            ...state.nestedVideoCommentsInfo,
            [commentId]: state.nestedVideoCommentsInfo[commentId]
              ? {
                  ...state.nestedVideoCommentsInfo[commentId],
                  comments: [
                    ...(state.nestedVideoCommentsInfo[commentId].comments ??
                      []),
                    ...commentsInfo.comments,
                  ],
                  continuation: commentsInfo.continuation,
                }
              : commentsInfo,
          }
        : state.nestedVideoCommentsInfo,
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
  selectNestedVideoCommentsInfo: selectDetailsPageNestedVideoCommentsInfo,
} = createFeature<string, IDetailsPageState>({
  name: detailsPageStateName,
  reducer: reducer,
});

export const selectNestedVideoCommentsInfoByCommentId = (commentId: string) =>
  createSelector(
    selectDetailsPageNestedVideoCommentsInfo,
    (nestedCommentsInfo) => nestedCommentsInfo[commentId] ?? undefined,
  );
