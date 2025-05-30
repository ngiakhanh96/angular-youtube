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
  linkedSignal,
  OnInit,
  signal,
  Signal,
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
  protected videos: WritableSignal<IVideoPlayerCardInfo[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;
  protected videosInfo: Signal<Record<string, IFormatStream> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  protected numberOfSkeletonPlayerItemsToFillBottomLine = signal(0);
  protected skeletonPlayerItemsToFillBottomLine = computed(() => {
    return this.initializeSkeletonItems(
      this.numberOfSkeletonPlayerItemsToFillBottomLine(),
      'filledInSkeleton',
    );
  });
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
    //TODO make these api calls silent
    this.dispatchAction(sharedActionGroup.loadYoutubeVideoCategories());
    this.videosWithMetaData = this.selectSignal(selectHomePageVideos);
    this.channelsInfo = this.selectSignal(selectChannelsInfo);
    this.videosInfo = this.selectSignal(selectVideosInfo);
    this.videos = linkedSignal<
      {
        videosWithMetaData: IPopularYoutubeVideos | undefined;
        channelsInfo: Record<string, IChannelItem> | undefined;
        videosInfo: Record<string, IFormatStream> | undefined;
      },
      IVideoPlayerCardInfo[]
    >({
      source: () => ({
        videosWithMetaData: this.videosWithMetaData(),
        channelsInfo: this.channelsInfo(),
        videosInfo: this.videosInfo(),
      }),
      computation: (input, prev) => {
        const videosWithMetaDataItems = input.videosWithMetaData?.items ?? [];
        const channelsInfo = input.channelsInfo ?? {};
        const videosInfo = input.videosInfo ?? {};
        if (videosWithMetaDataItems.length === 0) {
          return [
            ...(prev?.value ??
              this.initializeSkeletonItems(20, 'mainSkeleton')),
          ];
        }
        return (
          videosWithMetaDataItems
            .filter((p) => p.kind === 'youtube#video')
            .map((p) => ({
              isSkeleton: false,
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
    afterRenderEffect({
      read: () => {
        this.videos();
        this.resize();
      },
    });
  }

  initializeSkeletonItems(count: number, videoIdPrefix: string) {
    const initialSkeletonItems: IVideoPlayerCardInfo[] = [];
    for (let i = 0; i < count; i++) {
      initialSkeletonItems.push({
        isSkeleton: true,
        videoId: `${videoIdPrefix}${i}`,
        title: '',
        channelName: '',
        viewCount: 0,
        publishedDate: new Date(),
        duration: '',
        lengthSeconds: 0,
        channelLogoUrl: '',
        videoUrl: '',
        isVerified: false,
      });
    }
    return initialSkeletonItems;
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
    const itemsPerLine = this.calculateItemsPerLine(playerItems);
    if (itemsPerLine > 0) {
      const remaining = this.videos().length % itemsPerLine;
      const numberOfSkeletonItemsToMakeBottomLineFull =
        remaining === 0 ? 0 : itemsPerLine - remaining;
      this.numberOfSkeletonPlayerItemsToFillBottomLine.set(
        numberOfSkeletonItemsToMakeBottomLineFull + 2 * itemsPerLine,
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
