import {
  detailsPageEventGroup,
  DetailsPageStore,
} from '@angular-youtube/details-page-data-access';
import {
  IVideoPlaylistInfo,
  VideosPlaylistComponent,
  VideosRecommendationInfoComponent,
} from '@angular-youtube/details-page-ui';
import {
  AppSettingsService,
  BaseWithSandBoxComponent,
  sharedEventGroup,
} from '@angular-youtube/shared-data-access';
import {
  CustomRouteReuseStrategy,
  ICustomRouteReuseComponent,
  IVideoCategory,
  IVideoPlayerCardInfo,
  LoadingBarService,
  NativeYouTubePlayerComponent,
  SidebarService,
  Utilities,
  ViewMode,
} from '@angular-youtube/shared-ui';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import {
  IVideoDetailsInfo,
  VideoDetailsInfoComponent,
} from '../video-details-info/video-details-info.component';

@Component({
  selector: 'ay-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  imports: [
    NativeYouTubePlayerComponent,
    VideoDetailsInfoComponent,
    VideosRecommendationInfoComponent,
    VideosPlaylistComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--details-page-container-margin-top]': 'marginTop()',
    '[style.--video-recommendations-margin-top]':
      'videoRecommendationMarginTop()',
    '(document:keydown)': 'onKeydown($event, true)',
  },
})
//TODO handle responsive design when the screen is <= 1016px
export class VideoDetailsComponent
  extends BaseWithSandBoxComponent
  implements OnInit, ICustomRouteReuseComponent
{
  detailsPageStore = inject(DetailsPageStore);
  titleService = inject(Title);
  router = inject(Router);
  sidebarService = inject(SidebarService);
  loadingBarService = inject(LoadingBarService);
  appSettingsService = inject(AppSettingsService);
  document = inject(DOCUMENT);
  customRouteReuseStrategy = inject(CustomRouteReuseStrategy);
  videoId = signal('');
  videoRecommendationMarginTop = signal('44px');
  getVideoInfo = computed(() => {
    if (this.videoId() !== '') {
      return detailsPageEventGroup.loadYoutubeVideo({
        videoId: this.videoId(),
      });
    }
    return sharedEventGroup.empty();
  });
  getVideoCommentsInfo = computed(() => {
    if (this.videoId() !== '') {
      return detailsPageEventGroup.loadYoutubeVideoComments({
        videoId: this.videoId(),
      });
    }
    return sharedEventGroup.empty();
  });
  videoUrl = computed(() => {
    if (
      this.videoInfo()?.adaptiveFormats.filter((format) => format.url !== '')
        ?.length ??
      0 > 0
    ) {
      return this.videoInfo()
        ?.adaptiveFormats.filter(
          (format) => format.url !== '' && format.fps != null,
        )
        .sort((a, b) => +b.bitrate - +a.bitrate)[0]?.url;
    } else if (this.videoInfo()?.formatStreams) {
      return this.videoInfo()?.formatStreams[0]?.url;
    }
    return undefined;
  });
  audioUrl = computed(() => {
    if (
      this.videoInfo()?.adaptiveFormats.filter((format) => format.url !== '')
        ?.length ??
      0 > 0
    ) {
      return this.videoInfo()
        ?.adaptiveFormats.filter(
          (format) => format.url !== '' && format.audioQuality != null,
        )
        .sort((a, b) => {
          // Priority: lang%3DlanguageCode > lang%3Den > others
          const getLangPriority = (url: string) => {
            if (
              url.includes(
                `lang%3D${
                  this.appSettingsService.appConfig()?.languageCode ?? 'vi'
                }`,
              )
            )
              return 2;
            if (url.includes('lang%3Den')) return 1;
            return 0;
          };
          const aPriority = getLangPriority(a.url);
          const bPriority = getLangPriority(b.url);
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
          // Then, sort by bitrate descending
          return +b.bitrate - +a.bitrate;
        })[0]?.url;
    }
    return undefined;
  });

  viewMode = signal(ViewMode.Theater);
  mainPlayer = viewChild.required<NativeYouTubePlayerComponent>(
    NativeYouTubePlayerComponent,
  );
  theaterModeContainerElementRef = viewChild.required<ElementRef<HTMLElement>>(
    'theaterModeContainer',
  );
  defaultModeContainerElementRef = viewChild.required<ElementRef<HTMLElement>>(
    'defaultModeContainer',
  );
  ViewMode = ViewMode;
  videoInfo = this.detailsPageStore.videoInfo;
  videoCommentsInfo = this.detailsPageStore.videoCommentsInfo;
  videoDetailsInfo = computed<IVideoDetailsInfo | undefined>(() => {
    const videoInfo = this.videoInfo();
    if (videoInfo) {
      return {
        id: videoInfo.videoId,
        title: videoInfo.title,
        authorLogoUrl: videoInfo.authorThumbnails[1]?.url ?? '',
        author: videoInfo.author,
        subscriberCountText: this.convertToSubscriberCountText(
          videoInfo.subCountText,
        ),
        likeCount: videoInfo.likeCount,
        dislikeCount: videoInfo.dislikeCount,
        viewCount: videoInfo.viewCount,
        descriptionHtml: videoInfo.descriptionHtml,
        publishedDateEpoch: videoInfo.published,
        authorVerified: videoInfo.authorVerified,
      };
    }
    return undefined;
  });
  currentTime = signal(0);
  //TODO call api to get channel info/video url same as browse component
  recommendedVideos = computed<IVideoPlayerCardInfo[]>(() => {
    const videosInfo = this.detailsPageStore.recommendedVideosInfo();
    return videosInfo
      .filter((p) => p.type === 'video')
      .map((p) => ({
        isSkeleton: false,
        videoId: p.videoId ?? '',
        title: p.title ?? '',
        channelName: p.author ?? '',
        viewCount: +(p.viewCount ?? 0),
        publishedDate: Utilities.epochToDate(p.published),
        //TODO dont understand why youtube keep duration in seconds - 1 when playing the video in details page but keep it in seconds when showing in recommendation section
        lengthSeconds: p.lengthSeconds,
        channelLogoUrl: undefined,
        videoUrl: p.formatStreams[0]?.url ?? '',
        isVerified: p.authorVerified ?? false,
      }));
  });
  mainPlayerBorderRadius = computed(() =>
    this.viewMode() === ViewMode.Theater ? '0px' : '12px',
  );
  marginTop = computed(() =>
    this.viewMode() === ViewMode.Theater ? '0px' : '24px',
  );
  //TODO Need to find an api to get this
  videoCategories = signal<IVideoCategory[]>([
    {
      id: 'all',
      title: 'All',
    },
    {
      id: 'films',
      title: 'Films',
    },
    {
      id: 'animation',
      title: 'Animation',
    },
    {
      id: 'music',
      title: 'Music',
    },
    {
      id: 'lofi',
      title: 'Lofi',
    },
    {
      id: 'sports',
      title: 'Sports',
    },
    {
      id: 'LOL',
      title: 'LOL',
    },
    {
      id: 'travel',
      title: 'Travel',
    },
    {
      id: 'events',
      title: 'Events',
    },
    {
      id: 'gaming',
      title: 'Gaming',
    },
    {
      id: 'people',
      title: 'People',
    },
    {
      id: 'shopping',
      title: 'Shopping',
    },
  ]);
  isFirstTime = true;
  currentUrl = this.router.url;
  playlistInfo = this.detailsPageStore.playlist;
  playlistId = signal<string>('');
  loadNextPlaylistPage = signal<boolean>(false, { equal: () => false });
  getPlaylistInfo = computed(() => {
    if (this.playlistId() !== '') {
      return detailsPageEventGroup.loadYoutubePlaylistInfo({
        playlistId: this.playlistId(),
      });
    }
    return sharedEventGroup.empty();
  });
  getPlaylistItemsInfo = computed(() => {
    this.loadNextPlaylistPage();
    if (this.playlistId() !== '') {
      return detailsPageEventGroup.loadYoutubePlaylistItemsInfo({
        playlistId: this.playlistId(),
        nextPage: this.loadNextPlaylistPage(),
      });
    }
    return sharedEventGroup.empty();
  });
  playlistItemsInfo = computed<IVideoPlayerCardInfo[]>(() => {
    const videosPlaylistInfo =
      this.detailsPageStore.playlist().itemsInfo?.items ?? [];
    return videosPlaylistInfo.map(
      (p) =>
        <IVideoPlayerCardInfo>{
          isSkeleton: false,
          videoId: p.contentDetails.videoId ?? '',
          title: p.snippet.title ?? '',
          channelName: p.snippet.videoOwnerChannelTitle ?? '',
          viewCount: undefined,
          publishedDate: undefined,
          lengthSeconds: undefined,
          channelLogoUrl: undefined,
          videoUrl: '',
          isVerified: false,
          hideThumbnailSettingsButton: false,
        },
    );
  });
  playlistItemVideoIdToIndexMapping = computed(() =>
    this.playlistItemsInfo().reduce((acc, video, index) => {
      acc.set(video.videoId, index);
      return acc;
    }, new Map<string, number>()),
  );
  playlistDetailsInfo = computed<IVideoPlaylistInfo>(() => {
    const playlistInfo = this.playlistInfo().info;
    return {
      title: playlistInfo?.items[0]?.snippet.title ?? '',
      channelName: playlistInfo?.items[0]?.snippet.channelTitle ?? '',
      //not sure why for playlist created by youtube the itemCount is diff from result from playlistitems api
      totalVideoCount: Math.max(
        playlistInfo?.items[0]?.contentDetails.itemCount ?? 0,
        this.playlistItemsInfo().length,
      ),
    };
  });
  currentVideoId = '';
  currentPlaylistItemPosition = signal(1);
  static volumeStep = 0.05;

  constructor() {
    super();
    this.dispatchEventFromSignal(this.getVideoInfo);
    this.dispatchEventFromSignal(this.getVideoCommentsInfo);
    this.dispatchEventFromSignal(this.getPlaylistInfo);
    this.dispatchEventFromSignal(this.getPlaylistItemsInfo);
    effect(() => {
      this.titleService.setTitle(this.videoInfo()?.title ?? 'Angular Youtube');
    });
    effect(() => {
      if (this.playlistInfo().itemsInfo != null && this.videoId() === '') {
        const video = this.playlistInfo().itemsInfo!.items.find(
          (p) => p.contentDetails.videoId === this.currentVideoId,
        );
        if (video == null) {
          this.loadNextPlaylistPage.set(true);
        } else {
          this.videoId.set(this.currentVideoId);
        }
      }
    });
    afterRenderEffect({
      write: () => {
        this.mainPlayer().seekTo(this.currentTime());
      },
    });

    effect(() => {
      this.videoId();
      this.loadingBarService.load(25);
      if (this.playlistId() !== '' && this.videoId() !== '') {
        const currentPlaylistItemPosition =
          (this.playlistItemVideoIdToIndexMapping().get(this.videoId()) ?? 0) +
          1;
        this.currentPlaylistItemPosition.set(currentPlaylistItemPosition);
        if (
          currentPlaylistItemPosition <
            this.playlistDetailsInfo().totalVideoCount &&
          currentPlaylistItemPosition > this.playlistItemsInfo().length - 5
        ) {
          this.loadNextPlaylistPage.set(true);
        }
        void this.router.navigate(['watch'], {
          queryParams: {
            v: this.videoId(),
            list: this.playlistId(),
          },
        });
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(this.takeUntilDestroyed())
      .subscribe((params) => {
        if (this.isFirstTime) {
          this.dispatchEvent(detailsPageEventGroup.reset());
          this.isFirstTime = false;
        }

        this.load(params);

        // Focus after route change with small delay to ensure rendering is complete
        setTimeout(() => {
          (
            this.mainPlayer().hostElementRef.nativeElement as HTMLElement
          ).focus();
        });
      });
    NativeYouTubePlayerComponent.exitPictureInPicture(this.document, true);
    this.onRetrieveByRouteReuseStrategy();
    this.customRouteReuseStrategy.registerCachedComponentName(
      this.constructor.name,
    );
  }

  load(params: Params) {
    this.currentVideoId = params['v'] as string;
    const playlistId = params['list'] as string | undefined;
    if (playlistId != null && playlistId !== '') {
      this.playlistId.set(playlistId);
    } else {
      this.videoId.set(this.currentVideoId);
    }
    this.currentTime.set((params['t'] as number) ?? 0);
    this.currentUrl = this.router.url;
  }

  onKeydown(event: KeyboardEvent, onlyOnFullscreen = false) {
    if (!onlyOnFullscreen || this.document.fullscreenElement) {
      if (event.key === 'ArrowRight') {
        this.seekBy(5);
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        this.seekBy(-5);
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        this.setVolumeBy(VideoDetailsComponent.volumeStep);
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        this.setVolumeBy(-VideoDetailsComponent.volumeStep);
        event.preventDefault();
      }
    }
  }

  onPlayerWheel(event: WheelEvent) {
    // Normalize wheel delta across browsers and devices
    const delta = Math.sign(event.deltaY);
    const volumeChange = delta * -VideoDetailsComponent.volumeStep; // Inverted: scroll up = volume up

    this.setVolumeBy(volumeChange);
    event.preventDefault();
  }

  shouldAttachByRouteReuseStrategy(route: ActivatedRouteSnapshot): boolean {
    return this.videoId() === route.queryParams['v'];
  }

  onRetrieveByRouteReuseStrategy() {
    NativeYouTubePlayerComponent.exitPictureInPicture(this.document);
    this.sidebarService.setMiniSidebarState(false);
    this.sidebarService.setState(false);
    this.sidebarService.setSelectedIconName(null);
  }

  onStoreByRouteReuseStrategy() {
    this.sidebarService.setMiniSidebarState(true);
    this.mainPlayer().requestPictureInPicture(undefined, () => {
      this.customRouteReuseStrategy.setOriginalVideoUrl(this.currentUrl);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onLeavePictureInPicture(_event: PictureInPictureEvent) {
    const originalVideoUrl =
      this.customRouteReuseStrategy.getOriginalVideoUrl();
    if (!originalVideoUrl) {
      return;
    }
    if (!this.router.url.includes('/watch') && originalVideoUrl) {
      await this.router.navigateByUrl(originalVideoUrl);
    }
  }

  onCanPlay() {
    this.loadingBarService.load(100);
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }

  onViewModeChange(viewMode: ViewMode) {
    const mainPlayerElement = this.mainPlayer().hostElementRef
      .nativeElement as HTMLElement;
    const theaterContainerElement =
      this.theaterModeContainerElementRef().nativeElement;
    const defaultContainerElement =
      this.defaultModeContainerElementRef().nativeElement;
    if (viewMode === ViewMode.Default) {
      theaterContainerElement.removeChild(mainPlayerElement);
      defaultContainerElement.appendChild(mainPlayerElement);
      this.videoRecommendationMarginTop.set('0px');
    } else {
      defaultContainerElement.removeChild(mainPlayerElement);
      theaterContainerElement.appendChild(mainPlayerElement);
      this.videoRecommendationMarginTop.set('44px');
    }
    this.viewMode.set(viewMode);
  }

  async onNextVideo() {
    if (
      !this.document.pictureInPictureEnabled ||
      !this.document.pictureInPictureElement
    ) {
      if (this.playlistId() === '') {
        if (this.recommendedVideos()[0]?.videoId) {
          this.playlistId.set('');
          await this.router.navigate(['watch'], {
            queryParams: {
              v: this.recommendedVideos()[0].videoId,
            },
          });
        }
      } else {
        const currentIndex = this.playlistItemVideoIdToIndexMapping().get(
          this.videoId(),
        );
        if (currentIndex != null) {
          const nextIndex = currentIndex + 1;
          if (nextIndex < this.playlistItemsInfo().length) {
            const nextVideo = this.playlistItemsInfo()[nextIndex];
            this.videoId.set(nextVideo.videoId);
          }
        }
      }
    }
  }

  async onSelectRecommendedVideo(videoId: string) {
    this.playlistId.set('');
    await this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }

  seekBy(duration: number) {
    this.mainPlayer().seekBy(duration);
  }

  setVolumeBy(volume: number) {
    this.mainPlayer().setVolumeBy(volume);
  }

  async onShowMiniPlayer() {
    await this.router.navigate(['/']);
  }

  private convertToSubscriberCountText(subCountText: string) {
    subCountText = subCountText.trim();
    subCountText =
      subCountText === '' || subCountText === '-' ? '0' : subCountText;
    return `${subCountText} subscriber${
      !isNaN(parseInt(subCountText)) && parseInt(subCountText) <= 1 ? '' : 's'
    }`;
  }
}
