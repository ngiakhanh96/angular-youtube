import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '../svg-button-renderer/svg-button-renderer.component';
import {
  PlaceholderImageQuality,
  YouTubePlayerPlaceholderComponent,
} from '../youtube-player-placeholder/youtube-player-placeholder.component';

export enum ViewMode {
  Default,
  Theater,
}

export enum ScreenMode {
  Default,
  Full,
}

@Component({
  selector: 'ay-native-youtube-player',
  encapsulation: ViewEncapsulation.None,
  imports: [
    YouTubePlayerPlaceholderComponent,
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
  ],
  templateUrl: './native-youtube-player.component.html',
  styleUrls: ['./native-youtube-player.component.scss'],
  host: {
    '[style.--border-radius]': 'borderRadius()',
    '[style.display]': "'block'",
    '[style.height]': "'100%'",
    '[style.width]': "'100%'",
    '[style.aspectRatio]': "'16/9'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeYouTubePlayerComponent implements OnDestroy {
  /** YouTube Video ID to view */
  videoId = input.required<string>();

  /** YouTube Video Url to load */
  videoUrl = input.required<string>();

  /** Height of video player */
  height = input<string>('100%');

  /** Width of video player */
  width = input<string>('100%');

  borderRadius = input<string>('12px');

  /**
   * By default the player shows a placeholder image instead of loading the YouTube API which
   * improves the initial page load performance. This input allows for the behavior to be disabled.
   */
  disablePlaceholder = input(false, { transform: booleanAttribute });

  /** Accessible label for the play button inside of the placeholder. */
  placeholderButtonLabel = input<string>('Play video');

  /**
   * Quality of the displayed placeholder image. Defaults to `standard`,
   * because not all video have a high-quality placeholder.
   */
  placeholderImageQuality = input<PlaceholderImageQuality>('standard');

  videoPlayerRef =
    viewChild.required<ElementRef<HTMLMediaElement>>('videoPlayer');

  videoPlayerContainerRef = viewChild.required<ElementRef<HTMLDivElement>>(
    'videoPlayerContainer',
  );

  videoPlayer = computed(() => this.videoPlayerRef().nativeElement);

  showPlayButton = input(false);
  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  isVideoPlayed = signal(false);
  autoPlay = input<boolean>(false);
  mini = input<boolean>(true);
  viewMode = model<ViewMode>(ViewMode.Theater);
  ViewMode = ViewMode;
  screenMode = signal<ScreenMode>(ScreenMode.Default);
  ScreenMode = ScreenMode;
  autoNext = signal(true);
  isMuted = model(false);
  isHovered = signal(false);
  playerButtonsVisibility = computed(() =>
    !this.mini() && (this.isHovered() || !this.isVideoPlayed())
      ? 'visible'
      : 'hidden',
  );

  playerClick = output<HTMLMediaElement>();
  nextVideo = output<boolean>();
  /** The element that will be replaced by the iframe. */
  private readonly document = inject(DOCUMENT);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private static hoverAndRestTimeoutMs = 5000;

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  onFullScreenChange() {
    if (!this.document.fullscreenElement) {
      this.screenMode.set(ScreenMode.Default);
    } else {
      this.screenMode.set(ScreenMode.Full);
    }
  }

  @HostListener('mousemove')
  onMouseMove() {
    this.onMouseEnter();
  }

  constructor() {
    afterNextRender({
      read: () => {
        this.videoPlayer().addEventListener('click', () => {
          this.playerClick.emit(this.videoPlayer());
        });
      },
    });

    afterRenderEffect({
      read: () => {
        this.videoPlayer()?.load();
        if (this.autoPlay()) {
          this.playVideo();
          this.videoPlayer().muted = untracked(() => this.isMuted());
        } else {
          this.videoPlayer().muted = true;
          this.isMuted.set(true);
        }
      },
    });
  }

  ngOnDestroy() {
    this.clearHoverTimer();
  }

  onMouseEnter() {
    this.isHovered.set(true);
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => {
      this.isHovered.set(false);
      this.document.body.style.cursor = 'none';
    }, NativeYouTubePlayerComponent.hoverAndRestTimeoutMs);
  }

  onMouseLeave() {
    this.isHovered.set(false);
    this.clearHoverTimer();
  }

  playVideo() {
    this.videoPlayer()
      .play()
      .then(() => {
        this.isVideoPlayed.set(true);
      })
      .catch((error) => {
        this.isVideoPlayed.set(false);
        console.error('Error playing video:', error);
      });
  }

  pauseVideo() {
    if (this.isVideoPlayed()) {
      this.videoPlayer().pause();
      this.isVideoPlayed.set(false);
    }
  }

  toggleVideo() {
    if (this.isVideoPlayed()) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  toggleScreenMode() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen();
    } else {
      const element = this.videoPlayerContainerRef().nativeElement;
      element.requestFullscreen();
    }
  }

  toggleAutoNext() {
    this.autoNext.update((v) => !v);
  }

  toggleMute() {
    this.isMuted.update((v) => !v);
    this.videoPlayer().muted = this.isMuted();
  }

  toggleViewMode() {
    this.viewMode.update((v) =>
      v === ViewMode.Default ? ViewMode.Theater : ViewMode.Default,
    );
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    this.document.body.style.cursor = 'default';
  }
}
