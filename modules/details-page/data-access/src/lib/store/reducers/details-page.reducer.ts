import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
  IPlaylistInfo,
  IPlaylistItemsInfo,
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
  playlist: {
    info: IPlaylistInfo | undefined;
    itemsInfo: IPlaylistItemsInfo | undefined;
  };
}
export const initialDetailsPageState: IDetailsPageState = {
  videoInfo: undefined,
  recommendedVideosInfo: [],
  videoCommentsInfo: undefined,
  nestedVideoCommentsInfo: {},
  playlist: {
    info: undefined,
    itemsInfo: undefined,
  },
};

export const DetailsPageStore = signalStore(
  withState<IDetailsPageState>(initialDetailsPageState),
  withDetailsPageEffects(),
  withDetailsPageReducer(),
  withDetailsPageSelectors(),
);

export function withDetailsPageReducer<_>() {
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
      on(
        detailsPageEventGroup.loadYoutubePlaylistInfoSuccess,
        ({ payload: { playlistInfo } }, state) => ({
          ...state,
          playlist: {
            ...state.playlist,
            info: playlistInfo,
          },
        }),
      ),
      on(
        detailsPageEventGroup.loadYoutubePlaylistItemsInfoSuccess,
        ({ payload: { playlistItemsInfo, nextPage } }, state) => ({
          ...state,
          playlist: {
            ...state.playlist,
            itemsInfo: {
              ...playlistItemsInfo,
              items: nextPage
                ? [
                    ...(state.playlist.itemsInfo?.items ?? []),
                    ...playlistItemsInfo.items,
                  ]
                : playlistItemsInfo.items,
            },
          },
        }),
      ),
      on(detailsPageEventGroup.reset, () => initialDetailsPageState),
    ),
  );
}
