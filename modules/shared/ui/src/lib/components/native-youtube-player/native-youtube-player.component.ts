import { NgTemplateOutlet } from '@angular/common';
import {
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
import type { MediaPlayerClass } from 'dashjs';
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

type PlayerVideoElement = HTMLVideoElement & {
  audioElement?: HTMLAudioElement;
  disposePlayback?: () => void;
};

// TODO fix duplicate view-transition-name when navigating to details page
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
})
export class NativeYouTubePlayerComponent implements OnDestroy {
  /** YouTube Video ID to view */
  videoId = input.required<string>();

  /** YouTube Video Url to load */
  videoUrl = input<string | undefined>();

  /** MPEG-DASH manifest, preferred over the direct video/audio URLs. */
  dashUrl = input<string | undefined>();

  /** Preferred DASH audio language, with English and manifest defaults as fallbacks. */
  preferredAudioLanguage = input<string | undefined>();

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

  private dashPlayer?: MediaPlayerClass;
  private sourceVersion = 0;
  private sourceVideoId = '';
  private playbackMode: 'dash' | 'direct' | undefined;
  private playbackReady = false;
  private playbackDisposed = false;
  private wantsToPlay = false;
  private pendingSeek?: { videoId: string; time: number };
  private playbackVideoElement?: PlayerVideoElement;

  private get hasSeparateAudio() {
    return this.playbackMode === 'direct' && !!this.audioUrl();
  }

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
      write: () => {
        const video = this.videoPlayer() as PlayerVideoElement;
        this.playbackVideoElement = video;
        video.audioElement = this.audioPlayer();
        video.disposePlayback = () => this.disposePlayback();
        if (!this.autoPlay()) {
          this.muted.set(true);
        }
      },
    });

    afterRenderEffect({
      write: () => {
        const videoId = this.videoId();
        const dashUrl = this.dashUrl()?.trim();
        const videoUrl = this.videoUrl();
        const audioUrl = this.audioUrl();
        const language = this.preferredAudioLanguage();
        untracked(() =>
          this.loadSource(videoId, dashUrl, videoUrl, audioUrl, language),
        );
      },
    });

    afterRenderEffect(() => {
      if (this.mini()) {
        this.stopProgressTracking();
      } else {
        this.startProgressTracking();
      }
    });

    effect(() => {
      this.setVolume(this.volume());
    });

    effect(() => {
      this.setMuted(this.muted());
    });
  }

  ngOnDestroy() {
    this.disposePlayback();
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
    if (!this.playbackDisposed && (this.dashUrl() || this.videoUrl())) {
      this.wantsToPlay = true;
      if (!this.playbackReady) {
        return;
      }
      const version = this.sourceVersion;
      this.videoPlayer()
        .play()
        .catch((error) => {
          if (version !== this.sourceVersion || this.playbackDisposed) {
            return;
          }
          this.wantsToPlay = false;
          this.isVideoPlaying.set(false);
          console.log('Error playing video:', error);
        });
    }
  }

  pauseVideo() {
    this.wantsToPlay = false;
    this.videoPlayer().pause();
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

  onVideoClick() {
    this.playerClick.emit(this.videoPlayer());
  }

  onVideoEnded() {
    this.wantsToPlay = false;
    this.isVideoPlaying.set(false);
    this.isVideoEnded.set(true);
    if (this.autoNext()) {
      this.nextVideo.emit();
    }
  }

  onLoadedMetadata() {
    const duration = this.videoPlayer().duration;
    this.duration.set(Number.isFinite(duration) ? duration : 0);
    if (this.pendingSeek?.videoId === this.videoId()) {
      const time = this.pendingSeek.time;
      this.pendingSeek = undefined;
      this.seekTo(time);
    }
    this.synchronizeAudioWithVideo();
  }

  onVolumeChange() {
    if (!this.hasSeparateAudio) {
      return;
    }
    this.audioPlayer().muted = this.videoPlayer().muted;
    this.audioPlayer().volume = this.videoPlayer().volume;
  }

  onAudioLoadedMetadata() {
    this.onVolumeChange();
    this.synchronizeAudioWithVideo();
    if (this.isVideoPlaying()) {
      this.playAudio();
    }
  }

  onPlay() {
    if (this.playbackDisposed || !this.playbackReady) {
      return;
    }
    this.wantsToPlay = true;
    this.isVideoEnded.set(false);
    this.isVideoPlaying.set(true);
    this.synchronizeAudioWithVideo();
    this.playAudio();
  }

  onPause() {
    if (
      !this.playbackDisposed &&
      this.playbackReady &&
      this.wantsToPlay &&
      !this.videoPlayer().ended &&
      this.document.hidden &&
      this.continueToPlayWhenSwitchingTab()
    ) {
      this.playVideo();
      return;
    }
    if (this.playbackReady) {
      this.wantsToPlay = false;
    }
    this.isVideoPlaying.set(false);
    this.synchronizeAudioWithVideo();
    if (this.hasSeparateAudio) {
      this.audioPlayer().pause();
    }
  }

  onSeeking() {
    this.isSeeking = true;
    if (this.hasSeparateAudio) {
      this.audioPlayer().pause();
    }
  }

  onTimeUpdate() {
    if (this.isSeeking) {
      this.synchronizeAudioWithVideo();
    }
  }

  onSeeked() {
    this.isSeeking = false;
    if (this.isVideoPlaying()) {
      this.playAudio();
    }
  }

  onWaiting() {
    if (this.hasSeparateAudio) {
      this.audioPlayer().pause();
    }
  }

  onPlaying() {
    this.playAudio();
  }

  onCanPlay() {
    if (this.playbackDisposed || !this.playbackMode) {
      return;
    }
    this.playbackReady = true;
    if (this.wantsToPlay && this.videoPlayer().paused) {
      this.playVideo();
    }
    this.canPlay.emit();
  }

  onMediaError() {
    // dash.js handles media errors and its own recovery before emitting ERROR.
    if (this.playbackMode === 'direct') {
      this.wantsToPlay = false;
      this.isVideoPlaying.set(false);
      this.audioPlayer().pause();
      console.error('Error loading video:', this.videoPlayer().error);
    }
  }

  onLeavePictureInPicture(event: PictureInPictureEvent) {
    this.leavePictureInPicture.emit(event);
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
    if (!Number.isFinite(currentTime)) {
      return;
    }
    const video = this.videoPlayer();
    const time = Math.max(0, currentTime);
    if (video.readyState === 0 || this.sourceVideoId !== this.videoId()) {
      this.pendingSeek = { videoId: this.videoId(), time };
      return;
    }
    video.currentTime =
      this.duration() > 0 ? Math.min(time, this.duration()) : time;
  }

  seekBy(duration: number) {
    this.seekTo(
      (this.pendingSeek?.time ?? this.videoPlayer().currentTime) + duration,
    );
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
    const videoElement =
      document.pictureInPictureElement as PlayerVideoElement | null;
    if (document.pictureInPictureEnabled && videoElement) {
      if (destroyElement && videoElement) {
        const audioElement = videoElement.audioElement;
        videoElement.disposePlayback?.();
        // Pause and clear
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load(); // Release memory
        videoElement.remove(); // Remove from DOM

        if (audioElement) {
          audioElement.pause();
          audioElement.removeAttribute('src');
          audioElement.load();
          audioElement.remove();
        }
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

  private loadSource(
    videoId: string,
    dashUrl: string | undefined,
    videoUrl: string | undefined,
    audioUrl: string | undefined,
    language: string | undefined,
  ) {
    if (this.playbackDisposed) {
      return;
    }
    const version = ++this.sourceVersion;
    this.playbackReady = false;
    this.playbackMode = undefined;
    this.destroyDashPlayer();
    const video = this.videoPlayer();
    const audio = this.audioPlayer();
    video.pause();
    audio.pause();
    video.removeAttribute('src');
    audio.removeAttribute('src');
    video.load();
    audio.load();
    this.sourceVideoId = videoId;
    if (this.pendingSeek?.videoId !== videoId) {
      this.pendingSeek = undefined;
    }
    this.isSeeking = false;
    this.isVideoPlaying.set(false);
    this.isVideoEnded.set(false);
    this.isVideoPlayedLastTime.set(false);
    this.duration.set(0);
    this.currentTime.set(0);
    this.loadedProgress.set(0);
    this.playedProgress.set(0);
    this.wantsToPlay = this.autoPlay();
    video.volume = this.volume();
    video.muted = this.muted();

    if (dashUrl) {
      this.playbackMode = 'dash';
      this.loadDashSource(dashUrl, language, version);
    } else {
      this.playbackMode = 'direct';
      this.loadDirectSource(videoUrl, audioUrl);
    }
  }

  private async loadDashSource(
    url: string,
    language: string | undefined,
    version: number,
  ) {
    try {
      const { MediaPlayer } = await import('dashjs');
      if (version !== this.sourceVersion || this.playbackDisposed) {
        return;
      }
      const player = MediaPlayer().create();
      this.dashPlayer = player;
      const errors = MediaPlayer.errors;
      const terminalErrors = new Set<number>([
        // Native media errors reach ERROR only after dash.js exhausts decode recovery.
        1,
        2,
        3,
        4,
        5,
        errors.MANIFEST_LOADER_PARSING_FAILURE_ERROR_CODE,
        errors.MANIFEST_LOADER_LOADING_FAILURE_ERROR_CODE,
        errors.MANIFEST_ERROR_ID_PARSE_CODE,
        errors.MANIFEST_ERROR_ID_NOSTREAMS_CODE,
        errors.MANIFEST_ERROR_ID_MULTIPLEXED_CODE,
        errors.CAPABILITY_MEDIASOURCE_ERROR_CODE,
        errors.CAPABILITY_MEDIAKEYS_ERROR_CODE,
        errors.MEDIASOURCE_TYPE_UNSUPPORTED_CODE,
        errors.FRAGMENT_LOADER_LOADING_FAILURE_ERROR_CODE,
        errors.SEGMENT_BASE_LOADER_ERROR_CODE,
        errors.DOWNLOAD_ERROR_ID_MANIFEST_CODE,
        errors.DOWNLOAD_ERROR_ID_CONTENT_CODE,
        errors.DOWNLOAD_ERROR_ID_INITIALIZATION_CODE,
        errors.DOWNLOAD_ERROR_ID_SIDX_CODE,
        errors.URL_RESOLUTION_FAILED_GENERIC_ERROR_CODE,
        errors.APPEND_ERROR_CODE,
      ]);
      player.on(MediaPlayer.events.ERROR, (event) => {
        if (
          version === this.sourceVersion &&
          !this.playbackDisposed &&
          typeof event.error === 'object' &&
          terminalErrors.has(event.error.code)
        ) {
          this.pendingSeek ??= {
            videoId: this.videoId(),
            time: this.videoPlayer().currentTime,
          };
          this.playbackReady = false;
          // Let dash.js finish its error/reset handler before attaching direct media.
          queueMicrotask(() =>
            this.fallbackToDirectSource(version, event.error),
          );
        }
      });
      player.setCustomInitialTrackSelectionFunction((tracks) => {
        if (!tracks.some((track) => track.type === 'audio')) {
          return tracks;
        }
        for (const preferred of [language, 'en']) {
          if (!preferred) {
            continue;
          }
          const matches = tracks.filter(
            (track) =>
              track.lang?.toLowerCase().split('-')[0] ===
              preferred.toLowerCase().split('-')[0],
          );
          if (matches.length) {
            return matches;
          }
        }
        return tracks;
      });
      // Native canplay drives autoplay, allowing a queued play or pause during import/loading.
      player.initialize(this.videoPlayer(), url, false);
    } catch (error) {
      this.fallbackToDirectSource(version, error);
    }
  }

  private fallbackToDirectSource(version: number, error: unknown) {
    if (
      version !== this.sourceVersion ||
      this.playbackDisposed ||
      this.playbackMode !== 'dash'
    ) {
      return;
    }
    console.warn('DASH playback failed; trying direct media:', error);
    const time = this.pendingSeek?.time ?? this.videoPlayer().currentTime;
    this.pendingSeek = { videoId: this.videoId(), time };
    ++this.sourceVersion;
    this.playbackReady = false;
    this.playbackMode = undefined;
    this.destroyDashPlayer();
    this.videoPlayer().pause();
    this.isVideoPlaying.set(false);
    this.loadedProgress.set(0);
    this.loadDirectSource(this.videoUrl(), this.audioUrl());
  }

  private loadDirectSource(
    videoUrl: string | undefined,
    audioUrl: string | undefined,
  ) {
    this.playbackMode = 'direct';
    const video = this.videoPlayer();
    const audio = this.audioPlayer();
    if (!videoUrl) {
      this.wantsToPlay = false;
      video.removeAttribute('src');
      video.load();
      return;
    }
    video.src = videoUrl;
    if (audioUrl) {
      audio.src = audioUrl;
      audio.volume = this.volume();
      audio.muted = this.muted();
      audio.load();
    }
    video.load();
  }

  private destroyDashPlayer() {
    const player = this.dashPlayer;
    this.dashPlayer = undefined;
    // destroy() releases listeners, requests, and MediaSource buffers.
    player?.destroy();
  }

  private disposePlayback() {
    this.playbackDisposed = true;
    ++this.sourceVersion;
    this.wantsToPlay = false;
    this.playbackReady = false;
    this.playbackMode = undefined;
    this.destroyDashPlayer();
    this.stopProgressTracking();
    const video = this.playbackVideoElement;
    const audio = video?.audioElement;
    for (const media of [video, audio]) {
      if (media) {
        media.pause();
        media.removeAttribute('src');
        media.load();
      }
    }
    if (video) {
      delete video.disposePlayback;
      delete video.audioElement;
    }
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
    if (!this.hasSeparateAudio || !this.wantsToPlay) {
      return;
    }
    this.audioPlayer()
      .play()
      .catch((error) => {
        console.log('Error playing audio:', error);
      });
  }

  private synchronizeAudioWithVideo() {
    if (this.hasSeparateAudio && this.audioPlayer().readyState > 0) {
      this.audioPlayer().currentTime = this.videoPlayer().currentTime;
    }
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
        this.loadedProgress.set(Math.min(100, Math.max(0, loadedFraction)));
      }

      // Update played progress and current time
      if (this.duration() > 0) {
        const playedFraction = (video.currentTime / this.duration()) * 100;
        this.playedProgress.set(Math.min(100, Math.max(0, playedFraction)));
        this.currentTime.set(video.currentTime);
      }
    }, 250);
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
