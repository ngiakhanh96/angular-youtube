import {
  createHttpEffectAndUpdateResponse,
  IInvidiousVideoInfo,
  InvidiousHttpService,
  YoutubeHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { detailsPageEventGroup } from '../events/details-page.event-group';
import { IDetailsPageState } from '../reducers/details-page.reducer';

export function withDetailsPageEffects<_>() {
  return signalStoreFeature(
    { state: type<IDetailsPageState>() },
    withEffects(
      (
        store,
        events = inject(Events),
        invidiousService = inject(InvidiousHttpService),
        youtubeService = inject(YoutubeHttpService),
      ) => ({
        loadYoutubeVideoInfo$: createHttpEffectAndUpdateResponse(
          events,
          detailsPageEventGroup.loadYoutubeVideo,
          (event) => {
            return invidiousService.getVideoInfo(event.payload.videoId).pipe(
              switchMap((videoInfo) =>
                combineLatest([
                  ...videoInfo.recommendedVideos.map((p) =>
                    invidiousService.getVideoInfo(p.videoId!).pipe(
                      catchError((error: HttpErrorResponse) => {
                        console.error(error);
                        return of(<IInvidiousVideoInfo>(<unknown>{
                          videoId: p.videoId,
                          formatStreams: [],
                        }));
                      }),
                    ),
                  ),
                ]).pipe(
                  map((recommendedVideosInfo) => {
                    return [
                      videoInfo,
                      ...recommendedVideosInfo.filter((p) => p != null),
                    ] as const;
                  }),
                ),
              ),
              map(([videoInfo, ...recommendedVideosInfo]) => {
                return detailsPageEventGroup.loadYoutubeVideoSuccess({
                  videoInfo: videoInfo,
                  recommendedVideosInfo: recommendedVideosInfo,
                });
              }),
            );
          },
          false,
        ),
        loadYoutubeVideoCommentsInfo$: createHttpEffectAndUpdateResponse(
          events,
          detailsPageEventGroup.loadYoutubeVideoComments,
          (event) => {
            return invidiousService
              .getVideoCommentsInfo(
                event.payload.videoId,
                event.payload.sortBy,
                event.payload.continuation,
              )
              .pipe(
                map((commentsInfo) => {
                  return detailsPageEventGroup.loadYoutubeVideoCommentsSuccess({
                    commentId: event.payload.commentId,
                    commentsInfo: commentsInfo,
                    continuation: event.payload.continuation,
                  });
                }),
                catchError((error: HttpErrorResponse) => {
                  console.error(error);
                  return of(
                    detailsPageEventGroup.loadYoutubeVideoCommentsSuccess({
                      commentId: event.payload.commentId,
                      commentsInfo: {
                        commentCount: 0,
                        videoId: event.payload.videoId,
                        comments: [],
                        continuation: undefined,
                      },
                    }),
                  );
                }),
              );
          },
          false,
        ),
        loadYoutubePlaylistInfo$: createHttpEffectAndUpdateResponse(
          events,
          detailsPageEventGroup.loadYoutubePlaylistInfo,
          (event) => {
            return combineLatest([
              youtubeService.getPlaylistItemsInfo(
                event.payload.playlistId,
                event.payload.nextPage
                  ? store.playlist().itemsInfo?.nextPageToken
                  : undefined,
              ),
              youtubeService.getPlaylistInfo(event.payload.playlistId),
            ]).pipe(
              map(([playlistItemsInfo, playlistInfo]) => {
                return detailsPageEventGroup.loadYoutubePlaylistInfoSuccess({
                  playlistItemsInfo: playlistItemsInfo,
                  playlistInfo: playlistInfo,
                  nextPage: event.payload.nextPage,
                });
              }),
            );
          },
          false,
        ),
      }),
    ),
  );
}
