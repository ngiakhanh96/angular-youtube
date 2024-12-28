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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  viewChild,
} from '@angular/core';

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
})
//TODO handle responsive design when the screen is <= 1016px
export class VideoDetailsComponent
  extends BaseWithSandBoxComponent
  implements OnInit, OnDestroy
{
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
  videoElement = viewChild.required<NativeYouTubePlayerComponent, ElementRef>(
    NativeYouTubePlayerComponent,
    { read: ElementRef },
  );
  ViewMode = ViewMode;
  videoInfo: Signal<IInvidiousVideoInfo | undefined>;
  videoDetailsInfo = computed(() =>
    this.videoInfo()
      ? <IVideoDetailsInfo>{
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
  mainPlayerBorderRadius = signal('0px');
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
    const theaterContainer = document.getElementsByClassName(
      'details_page_player_container',
    )[0];
    const defaultContainer = document.getElementsByClassName(
      'details_page_info_video',
    )[0];
    if (this.mode() === ViewMode.Theater) {
      const adoptedVideo = document.adoptNode(video);
      defaultContainer?.appendChild(adoptedVideo);
      this.mainPlayerBorderRadius.set('12px');
      this.mode.set(ViewMode.Default);
    } else {
      const adoptedVideo = document.adoptNode(video);
      theaterContainer?.appendChild(adoptedVideo);
      this.mainPlayerBorderRadius.set('0px');
      this.mode.set(ViewMode.Theater);
    }
  }
}
