import {
  detailsPageActionGroup,
  selectDetailsPageRecommendedVideosInfo,
  selectDetailsPageVideoInfo,
} from '@angular-youtube/details-page-data-access';
import {
  IVideoDetailsInfo,
  VideoDetailsInfoComponent,
  VideosRecommendationInfoComponent,
} from '@angular-youtube/details-page-ui';
import {
  BaseWithSandBoxComponent,
  IInvidiousVideoInfo,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  NativeYouTubePlayerComponent,
  SidebarService,
  Utilities,
  ViewMode,
} from '@angular-youtube/shared-ui';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  implements OnInit, OnDestroy
{
  titleService = inject(Title);
  router = inject(Router);
  sidebarService = inject(SidebarService);
  videoId = signal('');
  videoRecommendationMarginTop = signal('24px');
  getVideoInfo = computed(() => {
    if (this.videoId() !== '') {
      return detailsPageActionGroup.loadYoutubeVideo({
        videoId: this.videoId(),
      });
    }
    return sharedActionGroup.empty();
  });
  videoUrl = computed(() => {
    if (this.videoInfo()?.formatStreams) {
      return this.videoInfo()?.formatStreams[0]?.url;
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
  ViewMode = ViewMode;
  videoInfo: Signal<IInvidiousVideoInfo | undefined>;
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
  recommendedVideosInfo: Signal<IInvidiousVideoInfo[]>;
  //TODO call api to get channel info/video url same as browse component
  recommendedVideos = computed<IVideoPlayerCardInfo[]>(() => {
    const videosInfo = this.recommendedVideosInfo();
    return videosInfo
      .filter((p) => p.type === 'video')
      .map((p) => ({
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
  document = inject(DOCUMENT);
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
  constructor() {
    super();
    this.dispatchActionFromSignal(this.getVideoInfo);
    this.videoInfo = this.selectSignal(selectDetailsPageVideoInfo);
    this.recommendedVideosInfo = this.selectSignal(
      selectDetailsPageRecommendedVideosInfo,
    );
    effect(() => {
      this.titleService.setTitle(this.videoInfo()?.title ?? 'Angular Youtube');
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(this.takeUntilDestroyed())
      .subscribe((params) => {
        this.videoId.set(params['v']);
      });
    this.sidebarService.setMiniSidebarState(false);
    this.sidebarService.setState(false);
  }

  ngOnDestroy(): void {
    this.sidebarService.setMiniSidebarState(true);
    this.dispatchAction(detailsPageActionGroup.reset());
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }

  onViewModeChange(viewMode: ViewMode) {
    const video = this.videoElement().nativeElement;
    const theaterContainer = this.theaterModeContainerElement().nativeElement;
    const defaultContainer = this.defaultModeContainerElement().nativeElement;
    if (viewMode === ViewMode.Default) {
      const adoptedVideo = this.document.adoptNode(video);
      defaultContainer?.appendChild(adoptedVideo);
      this.videoRecommendationMarginTop.set('0px');
    } else {
      const adoptedVideo = this.document.adoptNode(video);
      theaterContainer?.appendChild(adoptedVideo);
      this.videoRecommendationMarginTop.set('24px');
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
