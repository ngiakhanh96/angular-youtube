import {
  homePageActionGroup,
  selectChannelsInfo,
  selectHomePageVideos,
  selectVideosInfo,
} from '@angular-youtube/home-page-data-access';

import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
  IVideoCategories,
  selectVideoCategories,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

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
  protected videos: Signal<IVideoPlayerCardInfo[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;
  protected videosInfo: Signal<Record<string, IFormatStream> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  private router = inject(Router);
  private titleService = inject(Title);
  constructor() {
    super();
    this.titleService.setTitle('Angular Youtube');
    this.dispatchAction(
      homePageActionGroup.loadYoutubePopularVideos({
        nextPage: false,
        itemPerPage: 20,
      }),
    );
    this.dispatchAction(sharedActionGroup.loadYoutubeVideoCategories());
    this.videosWithMetaData = this.selectSignal(selectHomePageVideos);
    this.channelsInfo = this.selectSignal(selectChannelsInfo);
    this.videosInfo = this.selectSignal(selectVideosInfo);
    this.videos = computed<IVideoPlayerCardInfo[]>(() => {
      const videosWithMetaData = this.videosWithMetaData();
      const channelsInfo = this.channelsInfo() ?? {};
      const videosInfo = this.videosInfo() ?? {};
      return (
        videosWithMetaData?.items
          .filter((p) => p.kind === 'youtube#video')
          .map((p) => ({
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
            isVerified: false,
          })) ?? []
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
