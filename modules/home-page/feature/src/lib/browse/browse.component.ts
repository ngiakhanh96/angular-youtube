import {
  homePageEventGroup,
  HomePageStore,
} from '@angular-youtube/home-page-data-access';

import {
  BaseWithSandBoxComponent,
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
  IVideoCategories,
  sharedEventGroup,
} from '@angular-youtube/shared-data-access';
import {
  FixedTopDirective,
  InfiniteScrollDirective,
  IVideoCategory,
  IVideoPlayerCardInfo,
  LoadingBarService,
  SidebarService,
  Utilities,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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

@Component({
  selector: 'ay-browse',
  imports: [
    VideoPlayerCardComponent,
    InfiniteScrollDirective,
    VideoCategoriesComponent,
    FixedTopDirective,
    NgTemplateOutlet,
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
  protected homePageStore = inject(HomePageStore);
  protected videosWithMetaData: Signal<IPopularYoutubeVideos | undefined>;
  protected videos: WritableSignal<IVideoPlayerCardInfo[]>;
  protected channelsInfo: Signal<Record<string, IChannelItem> | undefined>;
  protected videosInfo: Signal<Record<string, IFormatStream> | undefined>;
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  protected numberOfSkeletonPlayerItemsToFillBottomLine = signal(0);
  protected skeletonPlayerItemsToFillBottomLine = computed(() => {
    return Utilities.createPlayerSkeletonItems(
      this.numberOfSkeletonPlayerItemsToFillBottomLine(),
      'filledInSkeleton',
    );
  });
  protected sidebarService = inject(SidebarService);
  protected playerItems = viewChildren<ElementRef<HTMLDivElement>>('gridItem');
  private router = inject(Router);
  private titleService = inject(Title);
  private loadingBarService = inject(LoadingBarService);

  constructor() {
    super();
    this.titleService.setTitle('Angular Youtube');
    this.dispatchEvent(
      homePageEventGroup.loadYoutubePopularVideos({
        nextPage: false,
        itemPerPage: 20,
      }),
    );
    this.dispatchEvent(sharedEventGroup.loadYoutubeVideoCategories());
    this.videosWithMetaData = this.homePageStore.videos;
    this.channelsInfo = this.homePageStore.channelsInfo;
    this.videosInfo = this.homePageStore.videosInfo;
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
              Utilities.createPlayerSkeletonItems(20, 'mainSkeleton')),
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

    this.videosCategories = this.sandbox.sharedStore.videoCategories;
    this.videosCategoriesViewModel = computed(() => {
      const videoCategories = this.videosCategories();
      return (
        videoCategories?.items.map((p) => ({
          title: p.snippet.title,
          id: p.id,
        })) ?? []
      );
    });
    effect(() => {
      const realVideos = this.videos()?.filter((p) => !p.isSkeleton) ?? [];
      if (realVideos.length > 0) {
        this.loadingBarService.load(100);
      }
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
    this.loadingBarService.load(25);
  }

  onScrollDown() {
    this.dispatchEvent(
      homePageEventGroup.loadYoutubePopularVideos({
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

  convertToPlayerSkeletonItem(
    video: IVideoPlayerCardInfo,
  ): IVideoPlayerCardInfo {
    return {
      ...video,
      isSkeleton: true,
    };
  }
}
