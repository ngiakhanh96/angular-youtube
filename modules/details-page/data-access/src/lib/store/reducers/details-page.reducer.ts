import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
} from '@angular-youtube/shared-data-access';
import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { withDetailsPageEffects } from '../effects/details-page.effect';
import { detailsPageEventGroup } from '../events/details-page.event-group';
import { withDetailsPageSelectors } from '../selector/details-page.selector';

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

export const DetailsPageStore = signalStore(
  withState<IDetailsPageState>(initialDetailsPageState),
  withDetailsPageEffects(),
  withDetailsPageReducer(),
  withDetailsPageSelectors(),
);

export function withDetailsPageReducer() {
  return signalStoreFeature(
    { state: type<IDetailsPageState>() },
    withReducer(
      on(
        detailsPageEventGroup.loadYoutubeVideoSuccess,
        ({ payload: { videoInfo, recommendedVideosInfo } }, state) => ({
          videoInfo: videoInfo,
          recommendedVideosInfo: recommendedVideosInfo,
        }),
      ),
      on(
        detailsPageEventGroup.loadYoutubeVideoCommentsSuccess,
        ({ payload: { commentsInfo, commentId, continuation } }, state) => ({
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
      on(detailsPageEventGroup.reset, () => initialDetailsPageState),
    ),
  );
}
