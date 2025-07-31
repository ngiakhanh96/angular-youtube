import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
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
    '(document:fullscreenchange)': 'onFullScreenChange()',
    '(document:webkitfullscreenchange)': 'onFullScreenChange()',
    '(document:mozfullscreenchange)': 'onFullScreenChange()',
    '(document:msfullscreenchange)': 'onFullScreenChange()',
    '(mousemove)': 'onMouseMove()',
    '(document:mouseup)': 'onMouseUp()',
    '(document:mousemove)': 'onDocumentMouseMove($event)',
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
    viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');

  audioPlayerRef =
    viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');

  videoPlayerContainerRef = viewChild.required<ElementRef<HTMLDivElement>>(
    'videoPlayerContainer',
  );

  progressBar = viewChild.required<ElementRef<HTMLElement>>('progressBar');
  loadedProgress = signal(0);
  playedProgress = signal(0);

  videoPlayer = computed(() => this.videoPlayerRef().nativeElement);
  audioPlayer = computed(() => this.audioPlayerRef().nativeElement);

  showPlayButton = input(false);
  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  isVideoPlaying = signal(false);
  isVideoPlayedLastTime = signal(false);
  isVideoEnded = signal(false);
  autoPlay = input<boolean>(false);
  mini = input<boolean>(true);
  viewMode = model<ViewMode>(ViewMode.Theater);
  isMuted = model(false);

  /** Audio URL for separate audio stream */
  audioUrl = input<string | undefined>(undefined);

  ViewMode = ViewMode;
  screenMode = signal<ScreenMode>(ScreenMode.Default);
  ScreenMode = ScreenMode;
  autoNext = signal(true);

  isHovered = signal(false);
  playerButtonsDisplay = computed(() =>
    !this.mini() && (this.isHovered() || !this.isVideoPlaying())
      ? 'flex'
      : 'none',
  );

  playerClick = output<HTMLMediaElement>();
  nextVideo = output<void>();
  canPlay = output<void>();
  leavePictureInPicture = output<PictureInPictureEvent>();

  currentTime = signal<number>(0);
  currentTimeString = computed(() => this.formatTime(this.currentTime()));
  duration = signal(0);
  durationString = computed(() => {
    const duration = this.duration();
    return this.formatTime(duration);
  });

  private progressUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private isSeeking = false;
  private readonly document = inject(DOCUMENT);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private static hoverAndRestTimeoutMs = 5000;

  onFullScreenChange() {
    if (!this.document.fullscreenElement) {
      this.screenMode.set(ScreenMode.Default);
    } else {
      this.screenMode.set(ScreenMode.Full);
    }
  }

  onMouseMove() {
    this.onMouseEnter();
  }
  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      const isVideoJustEnded = this.isVideoEnded();
      const isVideoEnded = this.videoPlayer().currentTime === this.duration();
      this.isVideoEnded.set(isVideoEnded);
      if ((isVideoJustEnded || this.isVideoPlayedLastTime()) && !isVideoEnded) {
        this.playVideo();
      }
      return;
    }
    this.isVideoEnded.set(false);
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (this.isDragging) {
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
          this.isVideoPlaying.set(false);
          this.isVideoEnded.set(true);
          if (this.autoNext()) {
            this.nextVideo.emit();
          }
        });

        this.videoPlayer().addEventListener('loadedmetadata', () => {
          this.duration.set(this.videoPlayer().duration);
          this.synchronizeAudioWithVideo();
        });
        this.videoPlayer().addEventListener('volumechange', () => {
          this.audioPlayer().muted = this.videoPlayer().muted;
          this.synchronizeAudioWithVideo();
        });
        this.videoPlayer().addEventListener('play', () => {
          this.synchronizeAudioWithVideo();
          this.playAudio();
        });
        this.videoPlayer().addEventListener('pause', () => {
          this.synchronizeAudioWithVideo();
          this.audioPlayer().pause();
        });
        this.videoPlayer().addEventListener('seeking', () => {
          this.isSeeking = true;
          this.audioPlayer().pause();
        });
        this.videoPlayer().addEventListener('timeupdate', () => {
          if (this.isSeeking) {
            this.synchronizeAudioWithVideo();
          }
        });
        this.videoPlayer().addEventListener('seeked', () => {
          this.isSeeking = false;
          if (this.isVideoPlaying()) {
            this.playAudio();
          }
        });
        this.videoPlayer().addEventListener('waiting', () => {
          this.audioPlayer().pause();
        });
        this.videoPlayer().addEventListener('playing', () => {
          this.playAudio();
        });
        this.videoPlayer().addEventListener('canplay', () => {
          this.canPlay.emit();
        });
        this.videoPlayer().addEventListener('canplaythrough', () => {
          this.canPlay.emit();
        });
        this.videoPlayer().addEventListener(
          'leavepictureinpicture',
          (event) => {
            this.leavePictureInPicture.emit(event);
            setTimeout(() => {
              this.playVideo();
            });
          },
        );
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
    if (this.mini()) {
      return;
    }
    this.isHovered.set(true);
    this.clearHoverTimer();
    this.hoverTimer = setTimeout(() => {
      this.isHovered.set(false);
      this.document.body.style.cursor = 'none';
    }, NativeYouTubePlayerComponent.hoverAndRestTimeoutMs);
  }

  onMouseLeave() {
    if (this.mini()) {
      return;
    }
    this.isHovered.set(false);
    this.clearHoverTimer();
    this.document.body.style.cursor = '';
  }

  playVideo() {
    this.videoPlayer()
      .play()
      .then(() => {
        this.isVideoEnded.set(false);
        this.isVideoPlaying.set(true);
      })
      .catch((error) => {
        this.isVideoPlaying.set(false);
        console.log('Error playing video:', error);
      });
  }

  pauseVideo() {
    if (this.isVideoPlaying()) {
      this.videoPlayer().pause();
      this.isVideoPlaying.set(false);
    }
  }

  toggleVideo() {
    if (this.isVideoPlaying()) {
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
    this.isDragging = true;
    this.isVideoPlayedLastTime.set(this.isVideoPlaying());
    this.pauseVideo();
    this.seekToPosition(event);
  }

  seekTo(currentTime: number) {
    this.videoPlayer().currentTime = currentTime;
  }

  requestPictureInPicture(
    destroyElement = false,
    videoElement?: HTMLVideoElement,
    successCallback?: () => void,
  ) {
    NativeYouTubePlayerComponent.exitPictureInPicture(
      this.document,
      destroyElement,
      videoElement,
    );
    if (this.document.pictureInPictureEnabled) {
      this.videoPlayer()
        .requestPictureInPicture()
        .then(() => {
          {
            this.isVideoPlaying() ? this.playVideo() : this.pauseVideo();
            successCallback?.();
          }
        })
        .catch((error) => {
          console.error('Error entering Picture-in-Picture mode:', error);
        });
    } else {
      console.warn('Picture-in-Picture is not supported by this browser.');
    }
  }

  static exitPictureInPicture(
    document: Document,
    destroyElement = false,
    videoElement?: HTMLVideoElement,
  ) {
    videoElement ??= document.pictureInPictureElement as HTMLVideoElement;
    if (document.pictureInPictureEnabled && videoElement) {
      if (destroyElement && videoElement) {
        // Pause and clear
        videoElement.pause();
        videoElement.src = ''; // Clear source
        videoElement.load(); // Release memory

        // Remove from DOM
        videoElement.remove();
      }
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch((error) => {
          console.error('Error exiting Picture-in-Picture mode:', error);
        });
      }
    } else {
      console.warn('Not currently in Picture-in-Picture mode.');
    }
  }

  private playAudio() {
    this.audioPlayer()
      .play()
      .catch((error) => {
        console.log('Error playing audio:', error);
      });
  }

  private synchronizeAudioWithVideo() {
    this.audioPlayer().currentTime = this.videoPlayer().currentTime;
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
    this.document.body.style.cursor = '';
  }
}
