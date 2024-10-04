import {
  homePageActionGroup,
  selectHomePageChannelsInfo,
  selectHomePageVideos,
} from '@angular-youtube/home-page-data-access';
import { ThumbnailComponent } from '@angular-youtube/home-page-ui';
import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IPopularYoutubeVideos,
  YoutubeService,
} from '@angular-youtube/shared-data-access';
import { Component, computed, inject, Signal } from '@angular/core';

export interface IThumbnailDetails {
  videoId: string;
  title: string;
  channelName: string;
  viewCount: number;
  publishedDate: Date;
  duration: string;
  channelLogoUrl: string;
}

@Component({
  selector: 'ay-browse',
  standalone: true,
  imports: [ThumbnailComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent extends BaseWithSandBoxComponent {
  private youtubeService = inject(YoutubeService);
  protected date = new Date(2023, 9, 2, 22, 30);
  protected videosWithMetaData: Signal<IPopularYoutubeVideos | undefined>;
  protected videos: Signal<IThumbnailDetails[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;

  constructor() {
    super();
    this.dispatchAction(
      homePageActionGroup.loadYoutubePopularVideos({
        nextPage: false,
        itemPerPage: 20,
      })
    );
    this.videosWithMetaData = this.select(selectHomePageVideos);
    this.channelsInfo = this.select(selectHomePageChannelsInfo);
    this.videos = computed(() => {
      const videosWithMetaData = this.videosWithMetaData();
      const channelsInfo = this.channelsInfo() ?? {};
      return (
        videosWithMetaData?.items.map(
          (p) =>
            <IThumbnailDetails>{
              videoId: p.id,
              title: p.snippet.title,
              channelName: p.snippet.channelTitle,
              viewCount: +p.statistics.viewCount,
              publishedDate: new Date(p.snippet.publishedAt),
              duration: p.contentDetails.duration,
              channelLogoUrl:
                channelsInfo[p.snippet.channelId]?.snippet.thumbnails.default
                  .url ?? '',
            }
        ) ?? []
      );
    });
  }
}
