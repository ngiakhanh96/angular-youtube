import { NgTemplateOutlet } from '@angular/common';
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
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';
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

//TODO explore to support youtube DASH streaming URL (dashUrl) with Dash.js
//TODO fix duplicate view-transition-name when navigating to details page
@Component({
  selector: 'ay-native-youtube-player',
  imports: [
    YouTubePlayerPlaceholderComponent,
    TextIconButtonComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './native-youtube-player.component.html',
  styleUrls: ['./native-youtube-player.component.scss'],
  host: {
    '[style.--border-radius]': 'borderRadius()',
    '[style.--player-buttons-display]': 'playerButtonsDisplay()',
    '[style.--volume-slider-width]': 'volumeSliderWidth()',
    '[style.view-transition-name]': 'viewTransitionName()',
    '[class.volume-slider-visible]': 'isVolumeSliderVisible()',
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

  viewTransitionName = computed(() => this.videoId());

  videoPlayerRef =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');

  audioPlayerRef =
    viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');

  videoPlayerContainerRef = viewChild.required<ElementRef<HTMLDivElement>>(
    'videoPlayerContainer',
  );

  progressBar = viewChild.required<ElementRef<HTMLElement>>('progressBar');
  volumeSlider = viewChild.required<ElementRef<HTMLElement>>('volumeSlider');
  loadedProgress = signal(0);
  playedProgress = signal(0);

  videoPlayer = computed(() => this.videoPlayerRef().nativeElement);
  audioPlayer = computed(() => this.audioPlayerRef().nativeElement);

  showPlayButton = input(false);
  playButtonIconWidthHeight = input('48px');
  playButtonIconViewBox = input('0 0 68 48');
  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  isVideoPlaying = signal(false);
  isVideoPlayedLastTime = signal(false);
  isVideoEnded = signal(false);
  autoPlay = input<boolean>(false);
  mini = input<boolean>(true);
  viewMode = model<ViewMode>(ViewMode.Theater);
  volume = model<number>(1);
  volumeSliderWidth = computed(() => {
    return `${this.muted() ? 0 : this.volume() * 100}%`;
  });
  muted = model<boolean>(false);
  isMuted = computed(() => this.muted() || this.volume() === 0);

  /** Audio URL for separate audio stream */
  audioUrl = input<string | undefined>(undefined);

  continueToPlayWhenSwitchingTab = input<boolean>(false);

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
  showMiniPlayer = output<void>();
  leavePictureInPicture = output<PictureInPictureEvent>();
  volumeSliderWheel = output<WheelEvent>();

  currentTime = signal<number>(0);
  currentTimeString = computed(() => this.formatTime(this.currentTime()));
  duration = signal(0);
  durationString = computed(() => {
    const duration = this.duration();
    return this.formatTime(duration);
  });
  hostElementRef = inject(ElementRef);

  playButtonIcon = computed(() => {
    const isVideoPlaying = this.isVideoPlaying();
    const isVideoEnded = this.isVideoEnded();
    if (isVideoPlaying) {
      return 'pause';
    }

    if (isVideoEnded) {
      return 'replay';
    }

    return 'play';
  });
  muteButtonIcon = computed(() => {
    return this.isMuted() ? 'volume-muted' : 'volume';
  });
  viewModeIcon = computed(() => {
    return this.viewMode() === ViewMode.Theater
      ? 'player-default-view-mode'
      : 'player-theater-view-mode';
  });
  playerScreenIcon = computed(() => {
    return this.screenMode() === ScreenMode.Default
      ? 'player-fullscreen'
      : 'player-inline';
  });
  isVolumeSliderVisible = computed(() => {
    return this.isKeyboardVolumeActive() || this.isVolumeHovered();
  });

  private progressUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private isDraggingProgressBar = false;
  private isDraggingVolume = false;
  private isSeeking = false;
  private readonly document = inject(DOCUMENT);

  private keyboardVolumeTimeout: ReturnType<typeof setTimeout> | null = null;
  private isKeyboardVolumeActive = signal(false);
  private isVolumeHovered = signal(false);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private static hoverAndRestTimeoutMs = 5000;

  onVolumeSliderWheel(event: WheelEvent) {
    this.volumeSliderWheel.emit(event);
  }

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
    if (this.isDraggingProgressBar) {
      this.isDraggingProgressBar = false;
      const isVideoJustEnded = this.isVideoEnded();
      const isVideoEnded = this.videoPlayer().currentTime === this.duration();
      this.isVideoEnded.set(isVideoEnded);
      if ((isVideoJustEnded || this.isVideoPlayedLastTime()) && !isVideoEnded) {
        this.playVideo();
      }
      return;
    }
    this.isVideoEnded.set(false);
    if (this.isDraggingVolume) {
      this.isDraggingVolume = false;
    }
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (this.isDraggingProgressBar) {
      this.seekToFromEvent(event);
    }
    if (this.isDraggingVolume) {
      this.setVolumeFromEvent(event);
    }
  }

  constructor() {
    afterNextRender({
      read: () => {
        (this.videoPlayer() as any).audioElement = this.audioPlayer();
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
          this.audioPlayer().volume = this.videoPlayer().volume;
        });
        this.videoPlayer().addEventListener('play', () => {
          this.isVideoEnded.set(false);
          this.isVideoPlaying.set(true);
          this.synchronizeAudioWithVideo();
          this.playAudio();
        });
        this.videoPlayer().addEventListener('pause', () => {
          if (this.document.hidden && this.continueToPlayWhenSwitchingTab()) {
            this.videoPlayer().play();
            return;
          }
          this.isVideoPlaying.set(false);
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
          },
        );
      },
    });

    afterRenderEffect({
      write: () => {
        this.videoUrl();
        this.videoPlayer()?.load();
        untracked(() => {
          if (this.autoPlay()) {
            this.playVideo();
            this.muted.set(false);
          } else {
            this.muted.set(true);
          }
          if (!this.mini()) {
            this.startProgressTracking();
          }
        });
      },
    });

    effect(() => {
      this.setVolume(this.volume());
    });

    effect(() => {
      this.setMuted(this.muted());
    });
  }

  ngOnDestroy() {
    this.clearHoverTimer();
    this.clearVolumeKeyboardTimer();
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
    this.isKeyboardVolumeActive.set(false);
    this.clearVolumeKeyboardTimer();
  }

  playVideo() {
    if (this.videoUrl() && this.videoUrl() !== '') {
      this.videoPlayer()
        .play()
        .catch((error) => {
          this.isVideoPlaying.set(false);
          console.log('Error playing video:', error);
        });
    }
  }

  pauseVideo() {
    if (this.isVideoPlaying()) {
      this.videoPlayer().pause();
    }
  }

  toggleVideo(event?: MouseEvent) {
    if (this.isVideoPlaying()) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
    event?.stopPropagation();
  }

  onNextVideo(event: MouseEvent) {
    this.nextVideo.emit();
    event.stopPropagation();
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

  toggleMute(event: MouseEvent) {
    if (!this.muted() && this.volume() === 0) {
      this.volume.set(1);
    } else {
      this.muted.update((v) => !v);
    }
    event.stopPropagation();
  }

  toggleViewMode() {
    this.viewMode.update((v) =>
      v === ViewMode.Default ? ViewMode.Theater : ViewMode.Default,
    );
  }

  onProgressBarMouseDown(event: MouseEvent) {
    this.isDraggingProgressBar = true;
    this.isVideoPlayedLastTime.set(this.isVideoPlaying());
    this.pauseVideo();
    this.seekToFromEvent(event);
  }

  onVolumeSliderMouseDown(event: MouseEvent) {
    this.isDraggingVolume = true;
    this.setVolumeFromEvent(event);
  }

  onVolumeContainerMouseEnter() {
    this.isVolumeHovered.set(true);
  }

  onVolumeContainerMouseLeave() {
    this.isVolumeHovered.set(false);
  }

  seekTo(currentTime: number) {
    this.videoPlayer().currentTime = currentTime;
  }

  seekBy(duration: number) {
    this.videoPlayer().currentTime += duration;
  }

  requestPictureInPicture(
    destroyElement = false,
    successCallback?: () => void,
  ) {
    NativeYouTubePlayerComponent.exitPictureInPicture(
      this.document,
      destroyElement,
    );
    if (this.document.pictureInPictureEnabled) {
      const previousIsVideoPlaying = this.isVideoPlaying();
      this.videoPlayer()
        .requestPictureInPicture()
        .then(() => {
          {
            if (previousIsVideoPlaying) {
              this.playVideo();
            } else {
              this.pauseVideo();
            }
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

  onButtonsContainerClick() {
    this.hostElementRef.nativeElement.focus();
  }

  static exitPictureInPicture(document: Document, destroyElement = false) {
    const videoElement = document.pictureInPictureElement as HTMLVideoElement;
    if (document.pictureInPictureEnabled && videoElement) {
      if (destroyElement && videoElement) {
        // Pause and clear
        videoElement.pause();
        videoElement.src = ''; // Clear source
        videoElement.load(); // Release memory
        videoElement.remove(); // Remove from DOM

        const audioElement: HTMLAudioElement = (videoElement as any)
          .audioElement;
        audioElement.pause();
        audioElement.src = ''; // Clear source
        audioElement.load(); // Release memory
        audioElement.remove(); // Remove from DOM
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

  setVolumeBy(volume: number) {
    const newVolume = Math.max(
      0,
      Math.min(1, +(this.volume() + volume).toFixed(2)),
    );
    this.volume.set(newVolume);
    if (newVolume > 0) {
      this.muted.set(false);
    }
    this.onMouseEnter();

    // Set keyboard volume active state immediately
    this.isKeyboardVolumeActive.set(true);
    this.clearVolumeKeyboardTimer();

    // Hide slider after 3 seconds of no keyboard activity
    this.keyboardVolumeTimeout = setTimeout(() => {
      this.isKeyboardVolumeActive.set(false);
    }, 3000);
  }

  private setVolume(volume: number) {
    this.videoPlayer().volume = volume;
  }

  private setMuted(muted: boolean) {
    this.videoPlayer().muted = muted;
  }

  private setVolumeFromEvent(event: MouseEvent) {
    const volumeSlider = this.volumeSlider().nativeElement;
    const rect = volumeSlider.getBoundingClientRect();
    const newVolume = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    this.volume.set(newVolume);
    if (newVolume > 0) {
      this.muted.set(false);
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

  private seekToFromEvent(event: MouseEvent) {
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

  private clearVolumeKeyboardTimer() {
    if (this.keyboardVolumeTimeout) {
      clearTimeout(this.keyboardVolumeTimeout);
      this.keyboardVolumeTimeout = null;
    }
  }
}
