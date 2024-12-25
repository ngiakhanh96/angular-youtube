import {
  detailsPageActionGroup,
  selectDetailsPageVideoInfo,
} from '@angular-youtube/details-page-data-access';
import {
  IVideoDetailsInfo,
  VideoDetailsInfoComponent,
} from '@angular-youtube/details-page-ui';
import {
  BaseWithSandBoxComponent,
  IInvidiousVideoInfo,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import {
  NativeYouTubePlayerComponent,
  SidebarService,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  imports: [NativeYouTubePlayerComponent, VideoDetailsInfoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
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
  mainPlayer = viewChild.required<NativeYouTubePlayerComponent>('mainPlayer');
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
          viewCount: this.videoInfo()?.viewCount,
          descriptionHtml: this.videoInfo()?.descriptionHtml,
          publishedDateEpoch: this.videoInfo()?.published,
          publishedDateText: this.videoInfo()?.publishedText,
        }
      : undefined,
  );

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
  ngOnDestroy(): void {
    this.sidebarService.setMiniSidebarState(true);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.videoId.set(params['v']);
    });
    this.sidebarService.setMiniSidebarState(false);
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }
}
