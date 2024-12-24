import {
  detailsPageActionGroup,
  selectDetailsPageVideoInfo,
} from '@angular-youtube/details-page-data-access';
import {
  BaseWithSandBoxComponent,
  IInvidiousVideoInfo,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import { NativeYouTubePlayerComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  imports: [NativeYouTubePlayerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
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
  protected videoInfo: Signal<IInvidiousVideoInfo | undefined>;
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
  }

  onClickMainPlayer() {
    this.mainPlayer().toggleVideo();
  }
}
