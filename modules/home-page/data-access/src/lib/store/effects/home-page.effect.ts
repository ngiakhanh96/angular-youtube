import {
  BaseEffects,
  IChannelItem,
  YoutubeService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { select } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { homePageActionGroup } from '../actions/home-page.action-group';
import { selectHomePageState } from '../reducers/home-page.reducer';

export class HomePageEffects extends BaseEffects {
  private youtubeService = inject(YoutubeService);
  loadYoutubePopularVideos$ = this.createHttpEffectWithStateAndUpdateResponse(
    homePageActionGroup.loadYoutubePopularVideos,
    (_) => this.store.pipe(select(selectHomePageState)),
    ([action, homePageState]) => {
      return this.youtubeService
        .getPopularVideos(
          action.itemPerPage,
          action.nextPage ? homePageState.nextPageToken : undefined
        )
        .pipe(
          switchMap((videosWithMetaData) => {
            return this.youtubeService
              .getChannelsInfo(
                videosWithMetaData.items.map((p) => p.snippet.channelId),
                action.itemPerPage
              )
              .pipe(
                map(
                  (channelsInfo) => [videosWithMetaData, channelsInfo] as const
                )
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
          })
        );
    }
  );
}
