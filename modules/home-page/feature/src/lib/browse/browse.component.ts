import {
  homePageActionGroup,
  selectChannelsInfo,
  selectHomePageVideos,
  selectVideoCategories,
} from '@angular-youtube/home-page-data-access';
import {
  IVideoCategoryViewModel,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/home-page-ui';
import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IPopularYoutubeVideos,
  IVideoCategories,
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
  imports: [
    VideoPlayerCardComponent,
    InfiniteScrollDirective,
    VideoCategoriesComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent extends BaseWithSandBoxComponent {
  protected videosWithMetaData: Signal<IPopularYoutubeVideos | undefined>;
  protected videos: Signal<IThumbnailDetails[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategoryViewModel[]>;
  constructor() {
    super();
    this.dispatchAction(
      homePageActionGroup.loadYoutubePopularVideos({
        nextPage: false,
        itemPerPage: 20,
      }),
    );
    this.dispatchAction(homePageActionGroup.loadYoutubeVideoCategories());
    this.videosWithMetaData = this.selectSignal(selectHomePageVideos);
    this.channelsInfo = this.selectSignal(selectChannelsInfo);
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
            },
        ) ?? []
      );
    });
    this.videosCategories = this.selectSignal(selectVideoCategories);
    this.videosCategoriesViewModel = computed(() => {
      const videoCategories = this.videosCategories();
      return (
        videoCategories?.items.map((p) => ({
          title: p.snippet.title,
          id: p.id,
        })) ?? []
      );
    });
  }

  onScrollDown() {
    this.dispatchAction(
      homePageActionGroup.loadYoutubePopularVideos({
        nextPage: true,
        itemPerPage: 20,
      }),
    );
  }
}
