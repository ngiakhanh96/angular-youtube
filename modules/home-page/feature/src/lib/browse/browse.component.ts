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
  CountPipe,
  FixedTopDirective,
  IVideoCategory,
  IVideoPlayerCardInfo,
  SidebarService,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  OnInit,
  signal,
  Signal,
  viewChild,
  viewChildren,
  WritableSignal,
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
    CountPipe,
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
  protected numberOfSkeletonItemsToFillViewPort: WritableSignal<number>;
  protected numberOfSkeletonItemsToMakeBottomLineFull = signal(0);
  protected sidebarService = inject(SidebarService);
  protected playerItems = viewChildren<ElementRef<HTMLDivElement>>('gridItem');
  protected skeletonPlayerItems =
    viewChildren<ElementRef<HTMLDivElement>>('gridSkeletonItem');
  protected gridContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('gridContainer');
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
    //TODO make these api calls silent
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
    this.numberOfSkeletonItemsToFillViewPort = linkedSignal({
      source: this.videos,
      computation: (videos, prev) => {
        if (videos.length === 0) {
          return prev?.value ?? 10;
        }
        return 0;
      },
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
    afterNextRender({
      write: () => {
        const skeletonPlayerItems = this.skeletonPlayerItems().map(
          (item) => item.nativeElement,
        );
        const itemsPerRow = this.calculateItemsPerLine(
          this.skeletonPlayerItems(),
        );

        // Calculate rows needed to fill viewport height plus 2 extra rows to encourage scrolling
        const gridContainerVisibleHeight = this.getVisibleHeight(
          this.gridContainer().nativeElement,
        );
        const itemHeight = skeletonPlayerItems[0].offsetHeight + 34; // 34 is the margin-bottom of the skeleton item
        const rowsToFillScreen = Math.ceil(
          gridContainerVisibleHeight / itemHeight,
        );
        const totalRows = rowsToFillScreen + 2; // Add 2 extra rows

        const totalItems = itemsPerRow * totalRows;
        this.numberOfSkeletonItemsToFillViewPort.set(totalItems);
      },
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
    // this.dispatchAction(
    //   homePageActionGroup.loadYoutubePopularVideos({
    //     nextPage: true,
    //     itemPerPage: 20,
    //   }),
    // );
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
    const itemsPerLine = this.calculateItemsPerLine(playerItems);
    if (itemsPerLine > 0) {
      const remaining = this.videos().length % itemsPerLine;
      const numberOfSkeletonItemsToMakeBottomLineFull =
        remaining === 0 ? 0 : itemsPerLine - remaining;
      this.numberOfSkeletonItemsToMakeBottomLineFull.set(
        numberOfSkeletonItemsToMakeBottomLineFull,
      );
    }
  }

  getVisibleHeight(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Element is completely above viewport
    if (rect.bottom <= 0) return 0;

    // Element is completely below viewport
    if (rect.top >= viewportHeight) return 0;

    // Calculate visible portion
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);

    return visibleBottom - visibleTop;
  }

  calculateItemsPerLine<T extends HTMLElement>(
    playerItems: readonly ElementRef<T>[],
  ) {
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
    return itemsPerLine;
  }
}
