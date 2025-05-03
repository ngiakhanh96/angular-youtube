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
    '[style.--player-buttons-display]': 'playerButtonsDisplay()',
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
  placeholderImageQuality = input<PlaceholderImageQuality>('low');

  videoPlayerRef =
    viewChild.required<ElementRef<HTMLMediaElement>>('videoPlayer');

  videoPlayerContainerRef = viewChild.required<ElementRef<HTMLDivElement>>(
    'videoPlayerContainer',
  );

  progressBar = viewChild.required<ElementRef<HTMLElement>>('progressBar');
  loadedProgress = signal(0);
  playedProgress = signal(0);

  videoPlayer = computed(() => this.videoPlayerRef().nativeElement);

  showPlayButton = input(false);
  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  isVideoPlayed = signal(false);
  isVideoPlayedLastTime = signal(false);
  autoPlay = input<boolean>(false);
  mini = input<boolean>(true);
  viewMode = model<ViewMode>(ViewMode.Theater);
  isMuted = model(false);

  ViewMode = ViewMode;
  screenMode = signal<ScreenMode>(ScreenMode.Default);
  ScreenMode = ScreenMode;
  autoNext = signal(true);

  isHovered = signal(false);
  playerButtonsDisplay = computed(() =>
    !this.mini() && (this.isHovered() || !this.isVideoPlayed())
      ? 'flex'
      : 'none',
  );

  playerClick = output<HTMLMediaElement>();
  nextVideo = output<boolean>();
  currentTime = signal<number>(0);
  currentTimeString = computed(() => this.formatTime(this.currentTime()));
  duration = signal(0);
  durationString = computed(() => {
    const duration = this.duration();
    return this.formatTime(duration);
  });

  private progressUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private readonly isDragging = signal(false);
  private readonly document = inject(DOCUMENT);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private static hoverAndRestTimeoutMs = 5000;

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:msfullscreenchange')
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

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.isDragging()) {
      this.isDragging.set(false);
      if (this.isVideoPlayedLastTime() && !this.videoPlayer().ended) {
        this.playVideo();
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    if (this.isDragging()) {
      this.seekToPosition(event);
    }
  }

  constructor() {
    afterNextRender({
      read: () => {
        this.videoPlayer().addEventListener('click', () => {
          this.playerClick.emit(this.videoPlayer());
        });

        this.videoPlayer().addEventListener('ended', () => {
          this.isVideoPlayed.set(false);
          if (this.autoNext()) {
            this.nextVideo.emit(true);
          }
        });

        this.videoPlayer().addEventListener('loadedmetadata', () => {
          this.duration.set(this.videoPlayer().duration);
        });
      },
    });

    afterRenderEffect({
      write: () => {
        this.videoUrl();
        this.videoPlayer()?.load();
        if (this.autoPlay()) {
          this.playVideo();
          this.videoPlayer().muted = untracked(() => this.isMuted());
        } else {
          this.videoPlayer().muted = true;
          this.isMuted.set(true);
        }
        if (!this.mini()) {
          this.startProgressTracking();
        }
      },
    });
  }

  ngOnDestroy() {
    this.clearHoverTimer();
    this.stopProgressTracking();
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

  onProgressBarMouseDown(event: MouseEvent) {
    this.isDragging.set(true);
    this.isVideoPlayedLastTime.set(this.isVideoPlayed());
    this.pauseVideo();
    this.seekToPosition(event);
  }

  seekTo(currentTime: number) {
    this.videoPlayer().currentTime = currentTime;
  }

  private formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const paddedSeconds = seconds.toString().padStart(2, '0');
    const paddedMinutes =
      hours > 0 ? minutes.toString().padStart(2, '0') : minutes.toString();

    return hours > 0
      ? `${hours}:${paddedMinutes}:${paddedSeconds}`
      : `${paddedMinutes}:${paddedSeconds}`;
  }

  private startProgressTracking() {
    this.stopProgressTracking();
    this.progressUpdateInterval = setInterval(() => {
      const video = this.videoPlayer();
      // Update loaded progress
      if (video.buffered.length > 0 && this.duration() > 0) {
        const loadedFraction =
          (video.buffered.end(video.buffered.length - 1) / this.duration()) *
          100;
        this.loadedProgress.set(loadedFraction);
      }

      // Update played progress and current time
      if (this.duration() > 0) {
        const playedFraction = (video.currentTime / this.duration()) * 100;
        this.playedProgress.set(playedFraction);
        this.currentTime.set(video.currentTime);
      }
    });
  }

  private stopProgressTracking() {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  private seekToPosition(event: MouseEvent) {
    const progressBar = this.progressBar().nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const position = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    this.seekTo(position * this.duration());
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    this.document.body.style.cursor = 'default';
  }
}
