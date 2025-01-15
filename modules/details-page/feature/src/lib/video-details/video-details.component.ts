import {
  detailsPageActionGroup,
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
  NativeYouTubePlayerComponent,
  SidebarService,
  TextIconButtonComponent,
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

export enum ViewMode {
  Default,
  Theater,
}

@Component({
  selector: 'ay-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  imports: [
    NativeYouTubePlayerComponent,
    VideoDetailsInfoComponent,
    TextIconButtonComponent,
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
  videoUrl: Signal<string | undefined>;
  mode = signal(ViewMode.Theater);
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
  mainPlayerBorderRadius = computed(() =>
    this.mode() === ViewMode.Theater ? '0px' : '12px',
  );
  marginTop = computed(() =>
    this.mode() === ViewMode.Theater ? '0px' : '24px',
  );
  document = inject(DOCUMENT);

  constructor() {
    super();
    this.dispatchActionFromSignal(this.getVideoInfo);
    this.videoInfo = this.selectSignal(selectDetailsPageVideoInfo);
    this.videoUrl = computed(() => {
      if (this.videoInfo()?.formatStreams) {
        return this.videoInfo()?.formatStreams[0].url;
      }
      return undefined;
    });
    effect(() => {
      this.titleService.setTitle(this.videoInfo()?.title ?? 'Angular Youtube');
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.videoId.set(params['v']);
    });
    this.sidebarService.setMiniSidebarState(false);
  }

  ngOnDestroy(): void {
    this.sidebarService.setMiniSidebarState(true);
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }

  onClickMode() {
    const video = this.videoElement().nativeElement;
    const theaterContainer = this.theaterModeContainerElement().nativeElement;
    const defaultContainer = this.defaultModeContainerElement().nativeElement;
    if (this.mode() === ViewMode.Theater) {
      const adoptedVideo = this.document.adoptNode(video);
      defaultContainer?.appendChild(adoptedVideo);
      this.mode.set(ViewMode.Default);
      this.videoRecommendationMarginTop.set('8px');
    } else {
      const adoptedVideo = this.document.adoptNode(video);
      theaterContainer?.appendChild(adoptedVideo);
      this.mode.set(ViewMode.Theater);
      this.videoRecommendationMarginTop.set('24px');
    }
  }
}
