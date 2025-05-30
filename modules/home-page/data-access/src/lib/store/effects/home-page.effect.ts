import {
  BaseEffects,
  IChannelItem,
  IFormatStream,
  IInvidiousVideoInfo,
  InvidiousHttpService,
  YoutubeHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { select } from '@ngrx/store';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { homePageActionGroup } from '../actions/home-page.action-group';
import { selectHomePageState } from '../reducers/home-page.reducer';

export class HomePageEffects extends BaseEffects {
  private youtubeService = inject(YoutubeHttpService);
  private invidiousService = inject(InvidiousHttpService);
  loadYoutubePopularVideos$ = this.createHttpEffectWithStateAndUpdateResponse(
    homePageActionGroup.loadYoutubePopularVideos,
    (_) => this.store.pipe(select(selectHomePageState)),
    ([action, homePageState]) => {
      return (
        action.nextPage &&
        homePageState.videos &&
        !homePageState.videos.nextPageToken
          ? of(homePageState.videos)
          : this.youtubeService.getPopularVideos(
              action.itemPerPage,
              action.videoCategory,
              action.nextPage ? homePageState.videos?.nextPageToken : undefined,
            )
      ).pipe(
        switchMap((videosWithMetaData) =>
          combineLatest([
            this.youtubeService.getChannelsInfo(
              videosWithMetaData.items.map((p) => p.snippet.channelId),
              action.itemPerPage,
            ),
            ...videosWithMetaData.items.map((p) =>
              this.invidiousService.getVideoInfo(p.id).pipe(
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
          return homePageActionGroup.loadYoutubePopularVideosSuccess({
            nextPage: action.nextPage,
            videos: videosWithMetaData,
            channelsInfo: channelsInfoMap,
            videosInfo: videosInfoMap,
          });
        }),
      );
    },
    false,
  );
}
