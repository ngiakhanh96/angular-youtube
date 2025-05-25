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
  FixedTopDirective,
  IVideoCategory,
  IVideoPlayerCardInfo,
  SidebarService,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChildren,
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
    FixedTopDirective,
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'resize()',
  },
})
export class BrowseComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  protected videosWithMetaData: Signal<IPopularYoutubeVideos | undefined>;
  protected videos: Signal<IVideoPlayerCardInfo[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;
  protected videosInfo: Signal<Record<string, IFormatStream> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  protected sidebarService = inject(SidebarService);
  protected playerItems = viewChildren<ElementRef<HTMLDivElement>>('gridItem');
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
    afterRenderEffect({
      read: () => {
        this.videos();
        this.resize();
      },
    });
  }

  ngOnInit(): void {
    this.sidebarService.setSelectedIconName('home');
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

  resize() {
    const playerItems = this.playerItems();
    let itemsPerLine = 0;
    if (playerItems.length > 0) {
      const firstLinePlayerItemOffsetTop =
        playerItems[0].nativeElement.offsetTop;
      itemsPerLine++;
      for (let i = 1; i < playerItems.length; i++) {
        const element = playerItems[i];
        if (element.nativeElement.offsetTop === firstLinePlayerItemOffsetTop) {
          itemsPerLine++;
        } else {
          break;
        }
      }
    }
    console.log(itemsPerLine);
  }
}
