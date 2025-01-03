import {
  homePageActionGroup,
  selectChannelsInfo,
  selectHomePageVideos,
  selectVideoCategories,
  selectVideosInfo,
} from '@angular-youtube/home-page-data-access';
import {
  IVideoCategoryViewModel,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/home-page-ui';
import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
  IVideoCategories,
} from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

export interface IThumbnailDetails {
  videoId: string;
  videoUrl: string;
  title: string;
  channelName: string;
  viewCount: number;
  publishedDate: Date;
  duration: string;
  channelLogoUrl: string;
}

@Component({
  selector: 'ay-browse',
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
  protected videosInfo: Signal<Record<string, IFormatStream> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategoryViewModel[]>;
  private router = inject(Router);
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
    this.videosInfo = this.selectSignal(selectVideosInfo);
    this.videos = computed(() => {
      const videosWithMetaData = this.videosWithMetaData();
      const channelsInfo = this.channelsInfo() ?? {};
      const videosInfo = this.videosInfo() ?? {};
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
              videoUrl: videosInfo[p.id]?.url ?? '',
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

  onSelect(videoId: string) {
    this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }
}
