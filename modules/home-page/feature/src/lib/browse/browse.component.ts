import {
  homePageActionGroup,
  selectHomePageChannelsInfo,
  selectHomePageVideos,
} from '@angular-youtube/home-page-data-access';
import { RichGridRenderComponent } from '@angular-youtube/home-page-ui';
import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

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
  imports: [RichGridRenderComponent, InfiniteScrollDirective],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent extends BaseWithSandBoxComponent {
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

  onScrollDown() {
    console.log('onScrollDown');
    this.dispatchAction(
      homePageActionGroup.loadYoutubePopularVideos({
        nextPage: true,
        itemPerPage: 20,
      })
    );
  }
}
