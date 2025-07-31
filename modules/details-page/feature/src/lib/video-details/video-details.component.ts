import {
  detailsPageEventGroup,
  DetailsPageStore,
} from '@angular-youtube/details-page-data-access';
import { VideosRecommendationInfoComponent } from '@angular-youtube/details-page-ui';
import {
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
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--details-page-container-margin-top]': 'marginTop()',
    '[style.--video-recommendations-margin-top]':
      'videoRecommendationMarginTop()',
  },
})
//TODO handle responsive design when the screen is <= 1016px
export class VideoDetailsComponent
  extends BaseWithSandBoxComponent
  implements OnInit, OnDestroy, ICustomRouteReuseComponent
{
  detailsPageStore = inject(DetailsPageStore);
  titleService = inject(Title);
  router = inject(Router);
  sidebarService = inject(SidebarService);
  loadingBarService = inject(LoadingBarService);
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
          // Priority: lang%3Dvi > lang%3Den > others
          const getLangPriority = (url: string) => {
            if (url.includes('lang%3Dvi')) return 2;
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
  videoElement = viewChild.required<
    NativeYouTubePlayerComponent,
    ElementRef<HTMLElement>
  >(NativeYouTubePlayerComponent, { read: ElementRef });
  theaterModeContainerElement = viewChild.required<ElementRef<HTMLElement>>(
    'theaterModeContainer',
  );
  defaultModeContainerElement = viewChild.required<ElementRef<HTMLElement>>(
    'defaultModeContainer',
  );
  player = viewChild.required<NativeYouTubePlayerComponent>('youtubePlayer');
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
        subscriberCountText: videoInfo.subCountText,
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

  constructor() {
    super();
    this.dispatchEventFromSignal(this.getVideoInfo);
    this.dispatchEventFromSignal(this.getVideoCommentsInfo);
    effect(() => {
      this.titleService.setTitle(this.videoInfo()?.title ?? 'Angular Youtube');
    });
    afterRenderEffect({
      write: () => {
        this.player().seekTo(this.currentTime());
      },
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
        this.videoId.set(params['v']);
        this.currentTime.set(params['t'] ?? 0);
        this.loadingBarService.load(25);
        this.currentUrl = this.router.url;
      });
    NativeYouTubePlayerComponent.exitPictureInPicture(this.document, true);
    this.onRetrieveByRouteReuseStrategy();
    this.customRouteReuseStrategy.registerCachedComponentName(
      this.constructor.name,
    );
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

  ngOnDestroy(): void {
    this.sidebarService.setMiniSidebarState(true);
  }

  onStoreByRouteReuseStrategy() {
    this.sidebarService.setMiniSidebarState(true);
    this.mainPlayer().requestPictureInPicture(undefined, () => {
      this.customRouteReuseStrategy.setOriginalVideoUrl(this.currentUrl);
    });
  }

  onLeavePictureInPicture(event: PictureInPictureEvent) {
    const originalVideoUrl =
      this.customRouteReuseStrategy.getOriginalVideoUrl();
    if (!originalVideoUrl) {
      return;
    }
    if (!this.router.url.includes('/watch') && originalVideoUrl) {
      this.router.navigateByUrl(originalVideoUrl);
    }
  }

  onCanPlay() {
    this.loadingBarService.load(100);
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }

  onViewModeChange(viewMode: ViewMode) {
    const video = this.videoElement().nativeElement;
    const theaterContainer = this.theaterModeContainerElement().nativeElement;
    const defaultContainer = this.defaultModeContainerElement().nativeElement;
    if (viewMode === ViewMode.Default) {
      const adoptedVideo = theaterContainer.removeChild(video);
      defaultContainer.appendChild(adoptedVideo);
      this.videoRecommendationMarginTop.set('0px');
    } else {
      const adoptedVideo = defaultContainer.removeChild(video);
      theaterContainer.appendChild(adoptedVideo);
      this.videoRecommendationMarginTop.set('44px');
    }
    this.viewMode.set(viewMode);
  }

  onNextVideo() {
    if (this.recommendedVideos()[0]?.videoId) {
      this.router.navigate(['watch'], {
        queryParams: {
          v: this.recommendedVideos()[0].videoId,
        },
      });
    }
  }
}
