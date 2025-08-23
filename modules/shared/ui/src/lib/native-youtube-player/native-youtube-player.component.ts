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
  volumeSlider = viewChild.required<ElementRef<HTMLElement>>('volumeSlider');
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
  volume = signal(1);
  volumeIconPath = computed(() => {
    const vol = this.volume();
    if (this.isMuted() || vol === 0) {
      return 'm 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z';
    }
    if (vol > 0 && vol <= 0.5) {
      return 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z';
    }
    return 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z';
  });

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
  leavePictureInPicture = output<PictureInPictureEvent>();

  currentTime = signal<number>(0);
  currentTimeString = computed(() => this.formatTime(this.currentTime()));
  duration = signal(0);
  durationString = computed(() => {
    const duration = this.duration();
    return this.formatTime(duration);
  });
  hostElementRef = inject(ElementRef);

  private progressUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private isDraggingVolume = false;
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
    this.isDraggingVolume = false;
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.seekToPosition(event);
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
          this.synchronizeAudioWithVideo();
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

        if (untracked(this.isMuted)) {
          this.volume.set(0);
        } else {
          this.volume.set(1);
        }
        this.videoPlayer().volume = this.volume();
        this.audioPlayer().volume = this.volume();
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
      .catch((error) => {
        this.isVideoPlaying.set(false);
        console.log('Error playing video:', error);
      });
  }

  pauseVideo() {
    if (this.isVideoPlaying()) {
      this.videoPlayer().pause();
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

    if (!this.isMuted() && this.volume() === 0) {
      this.setVolume(1);
    }
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

  onVolumeSliderMouseDown(event: MouseEvent) {
    this.isDraggingVolume = true;
    this.setVolumeFromEvent(event);
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
            previousIsVideoPlaying ? this.playVideo() : this.pauseVideo();
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

  private setVolume(volume: number) {
    this.volume.set(volume);
    this.videoPlayer().volume = volume;
    this.audioPlayer().volume = volume;
  }

  private setVolumeFromEvent(event: MouseEvent) {
    const volumeSlider = this.volumeSlider().nativeElement;
    const rect = volumeSlider.getBoundingClientRect();
    const newVolume = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    this.setVolume(newVolume);

    if (newVolume > 0 && this.isMuted()) {
      this.isMuted.set(false);
      this.videoPlayer().muted = false;
    } else if (newVolume === 0 && !this.isMuted()) {
      this.isMuted.set(true);
      this.videoPlayer().muted = true;
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
