import {
  createHttpEffectAndUpdateResponse,
  IInvidiousVideoInfo,
  InvidiousHttpService,
  IVideoComment,
  YoutubeHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { detailsPageEventGroup } from '../events/details-page.event-group';
import { IDetailsPageState } from '../reducers/details-page.reducer';

export function withDetailsPageEffects<_>() {
  return signalStoreFeature(
    { state: type<IDetailsPageState>() },
    withEventHandlers(
      (
        store,
        events = inject(Events),
        invidiousService = inject(InvidiousHttpService),
        youtubeService = inject(YoutubeHttpService),
      ) => ({
        postYoutubeVideoComment$: createHttpEffectAndUpdateResponse(
          events,
          detailsPageEventGroup.postYoutubeVideoComment,
          ({ payload: { videoId, channelId, text } }) =>
            youtubeService.insertCommentThread(videoId, channelId, text).pipe(
              map((thread) => {
                const { id, snippet } = thread.snippet.topLevelComment;
                const content = snippet.textOriginal ?? text;
                const comment: IVideoComment = {
                  commentId: id,
                  author: snippet.authorDisplayName,
                  authorThumbnail: snippet.authorProfileImageUrl,
                  authorUrl: snippet.authorChannelUrl ?? '',
                  authorId: snippet.authorChannelId?.value ?? '',
                  verified: false,
                  content,
                  contentHtml: snippet.textDisplay,
                  likeCount: snippet.likeCount,
                  published: Math.floor(Date.parse(snippet.publishedAt) / 1000),
                  publishedText: 'Just now',
                  isEdited: snippet.updatedAt !== snippet.publishedAt,
                  isPinned: false,
                  authorIsChannelOwner:
                    snippet.authorChannelId?.value === channelId,
                };
                return detailsPageEventGroup.postYoutubeVideoCommentSuccess({
                  videoId,
                  comment,
                });
              }),
            ),
          false,
        ),
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
                      continuation: event.payload.continuation,
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
            return youtubeService
              .getPlaylistInfo(event.payload.playlistId)
              .pipe(
                map((playlistInfo) => {
                  return detailsPageEventGroup.loadYoutubePlaylistInfoSuccess({
                    playlistInfo: playlistInfo,
                  });
                }),
              );
          },
          false,
        ),
        loadYoutubePlaylistItemsInfo$: createHttpEffectAndUpdateResponse(
          events,
          detailsPageEventGroup.loadYoutubePlaylistItemsInfo,
          (event) => {
            return youtubeService
              .getPlaylistItemsInfo(
                event.payload.playlistId,
                event.payload.nextPage
                  ? store.playlist().itemsInfo?.nextPageToken
                  : undefined,
              )
              .pipe(
                map((playlistItemsInfo) => {
                  return detailsPageEventGroup.loadYoutubePlaylistItemsInfoSuccess(
                    {
                      playlistItemsInfo: playlistItemsInfo,
                      nextPage: event.payload.nextPage,
                    },
                  );
                }),
              );
          },
          false,
        ),
      }),
    ),
  );
}
