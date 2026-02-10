import {
  createHttpEffectAndUpdateResponse,
  IChannelItem,
  IFormatStream,
  IInvidiousVideoInfo,
  InvidiousHttpService,
  YoutubeHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { homePageEventGroup } from '../events/home-page.event-group';
import { IHomePageState } from '../reducers/home-page.reducer';

export function withHomePageEffects<_>() {
  return signalStoreFeature(
    { state: type<IHomePageState>() },
    withEventHandlers(
      (
        store,
        events = inject(Events),
        invidiousService = inject(InvidiousHttpService),
        youtubeService = inject(YoutubeHttpService),
      ) => ({
        loadYoutubePopularVideos$: createHttpEffectAndUpdateResponse(
          events,
          homePageEventGroup.loadYoutubePopularVideos,
          (event) => {
            return (
              event.payload.nextPage &&
              store.videos() &&
              !store.videos()?.nextPageToken
                ? of(store.videos()!)
                : youtubeService.getPopularVideos(
                    event.payload.itemPerPage,
                    event.payload.videoCategory,
                    event.payload.nextPage
                      ? store.videos()?.nextPageToken
                      : undefined,
                  )
            ).pipe(
              switchMap((videosWithMetaData) =>
                combineLatest([
                  youtubeService.getChannelsInfo(
                    videosWithMetaData.items.map((p) => p.snippet.channelId),
                    event.payload.itemPerPage,
                  ),
                  ...videosWithMetaData.items.map((p) =>
                    invidiousService.getVideoInfo(p.id).pipe(
                      catchError((error: HttpErrorResponse) => {
                        console.error(error);
                        return of(<IInvidiousVideoInfo>(<unknown>{
                          videoId: p.id,
                          formatStreams: [],
                        }));
                      }),
                    ),
                  ),
                ]).pipe(
                  map((channelsAndVideosInfo) => {
                    const [channelsInfo, ...videosInfo] = channelsAndVideosInfo;
                    return [
                      videosWithMetaData,
                      channelsInfo,
                      ...videosInfo.filter((p) => p != null),
                    ] as const;
                  }),
                ),
              ),
              map(([videosWithMetaData, channelsInfo, ...videosInfo]) => {
                const channelsInfoMap: Record<string, IChannelItem> = {};
                channelsInfo.items.forEach((p) => (channelsInfoMap[p.id] = p));
                const videosInfoMap: Record<string, IFormatStream> = {};
                videosInfo.forEach((p) => {
                  if (p.formatStreams.length > 0) {
                    videosInfoMap[p.videoId] = p.formatStreams[0];
                  } else {
                    videosWithMetaData.items = videosWithMetaData.items.filter(
                      (a) => a.id !== p.videoId,
                    );
                  }
                });
                return homePageEventGroup.loadYoutubePopularVideosSuccess({
                  nextPage: event.payload.nextPage,
                  videos: videosWithMetaData,
                  channelsInfo: channelsInfoMap,
                  videosInfo: videosInfoMap,
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
