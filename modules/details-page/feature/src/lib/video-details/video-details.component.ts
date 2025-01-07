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
  videoDetailsInfo = computed(() =>
    this.videoInfo()
      ? <IVideoDetailsInfo>{
          id: this.videoInfo()?.videoId,
          title: this.videoInfo()?.title,
          authorLogoUrl: this.videoInfo()?.authorThumbnails[1].url,
          author: this.videoInfo()?.author,
          subscriberCountText: this.videoInfo()?.subCountText,
          likeCount: this.videoInfo()?.likeCount,
          dislikeCount: this.videoInfo()?.dislikeCount,
          viewCount: this.videoInfo()?.viewCount,
          descriptionHtml: this.videoInfo()?.descriptionHtml,
          publishedDateEpoch: this.videoInfo()?.published,
          publishedDateText: this.videoInfo()?.publishedText,
          authorVerified: this.videoInfo()?.authorVerified,
        }
      : undefined,
  );
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
    } else {
      const adoptedVideo = this.document.adoptNode(video);
      theaterContainer?.appendChild(adoptedVideo);
      this.mode.set(ViewMode.Theater);
    }
  }
}
