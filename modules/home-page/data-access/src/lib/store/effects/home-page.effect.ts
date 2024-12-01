import {
  BaseEffects,
  IChannelItem,
  loginActionGroup,
  YoutubeService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { map, of, switchMap } from 'rxjs';
import { homePageActionGroup } from '../actions/home-page.action-group';
import { selectHomePageState } from '../reducers/home-page.reducer';

export class HomePageEffects extends BaseEffects {
  private youtubeService = inject(YoutubeService);
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
        switchMap((videosWithMetaData) => {
          return this.youtubeService
            .getChannelsInfo(
              videosWithMetaData.items.map((p) => p.snippet.channelId),
              action.itemPerPage,
            )
            .pipe(
              map(
                (channelsInfo) => [videosWithMetaData, channelsInfo] as const,
              ),
            );
        }),
        map(([videosWithMetaData, channelsInfo]) => {
          const channelsInfoMap: Record<string, IChannelItem> = {};
          channelsInfo.items.forEach((p) => (channelsInfoMap[p.id] = p));
          return homePageActionGroup.loadYoutubePopularVideosSuccess({
            nextPage: action.nextPage,
            videos: videosWithMetaData,
            channelsInfo: channelsInfoMap,
          });
        }),
      );
    },
  );

  loadYoutubeVideoCategories$ = this.createHttpEffectAndUpdateResponse(
    homePageActionGroup.loadYoutubeVideoCategories,
    () => {
      return this.youtubeService.getVideoCategories().pipe(
        map((videoCategories) => {
          return homePageActionGroup.loadYoutubeVideoCategoriesSuccess({
            videoCategories: videoCategories,
          });
        }),
      );
    },
  );

  updateAccessTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginActionGroup.updateAccessTokenSuccess),
      map((_) => {
        return homePageActionGroup.loadMyChannelInfo();
      }),
    ),
  );

  loadMyChannelInfo$ = this.createHttpEffectAndUpdateResponse(
    homePageActionGroup.loadMyChannelInfo,
    () => {
      return this.youtubeService.getMyChannelInfo().pipe(
        map((myChannelInfo) => {
          return homePageActionGroup.loadMyChannelInfoSuccess({
            myChannelInfo: myChannelInfo,
          });
        }),
      );
    },
  );
}
