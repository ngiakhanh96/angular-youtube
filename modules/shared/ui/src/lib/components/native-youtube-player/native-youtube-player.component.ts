import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
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
  linkedSignal,
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

type DocumentPictureInPictureWindow = Window & {
  documentPictureInPicture?: {
    requestWindow(options: {
      width: number;
      height: number;
      disallowReturnToOpener: boolean;
      preferInitialWindowPlacement: boolean;
    }): Promise<Window>;
  };
};

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
    '[class.document-pip-player]': 'isDocumentPictureInPicture()',
    '(document:fullscreenchange)': 'onFullScreenChange()',
    '(document:webkitfullscreenchange)': 'onFullScreenChange()',
    '(document:mozfullscreenchange)': 'onFullScreenChange()',
    '(document:msfullscreenchange)': 'onFullScreenChange()',
    '(document:mouseup)': 'onMouseUp($event)',
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

  viewTransitionNameSuffix = input('');
  viewTransitionName = computed(
    () => `${this.videoId()}${this.viewTransitionNameSuffix()}`,
  );

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
  muted = linkedSignal(() => this.volume() === 0);

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
  returnToVideo = output<boolean>();
  volumeSliderWheel = output<WheelEvent>();
  readonly isDocumentPictureInPicture = signal(false);

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
    return this.muted() ? 'volume-muted' : 'volume';
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
  hasSeparateAudio = computed(() => {
    const playbackMode = this.playbackMode();
    const audioUrl = this.audioUrl();
    return playbackMode === 'direct' && !!audioUrl;
  });

  private progressUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private isDraggingProgressBar = false;
  private isDraggingVolume = false;
  private isSeeking = false;
  private readonly document = inject(DOCUMENT);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private closeDocumentPictureInPicture?: (destroyElement?: boolean) => void;
  private static readonly documentPictureInPictureSessions = new WeakMap<
    Document,
    { close: (destroyElement?: boolean) => void }
  >();

  private keyboardVolumeTimeout: ReturnType<typeof setTimeout> | null = null;
  private isKeyboardVolumeActive = signal(false);
  private isVolumeHovered = signal(false);

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private static hoverAndRestTimeoutMs = 5000;

  private dashPlayer?: MediaPlayerClass;
  private sourceVersion = 0;
  private sourceVideoId = '';
  private playbackMode = signal<'dash' | 'direct' | undefined>(undefined);
  private playbackReady = false;
  private playbackDisposed = false;
  private wantsToPlay = false;
  private pendingSeek?: { videoId: string; time: number };
  private playbackVideoElement?: HTMLVideoElement;
  private playbackAudioElement?: HTMLAudioElement;
  private previousDashUrl?: string;

  onVolumeSliderWheel(event: WheelEvent) {
    this.volumeSliderWheel.emit(event);
  }

  onFullScreenChange() {
    if (
      this.document.fullscreenElement ===
      this.videoPlayerContainerRef().nativeElement
    ) {
      this.screenMode.set(ScreenMode.Full);
      this.onMouseEnter();
    } else {
      this.screenMode.set(ScreenMode.Default);
      this.onMouseLeave();
    }
  }

  onMouseMove() {
    this.onMouseEnter();
  }

  onMouseUp(event: MouseEvent) {
    if (this.isDraggingProgressBar) {
      this.seekToFromEvent(event);
      const time = this.currentTime();
      this.isDraggingProgressBar = false;
      this.seekTo(time);
      const isVideoJustEnded = this.isVideoEnded();
      const isVideoEnded = time === this.duration();
      this.isVideoEnded.set(isVideoEnded);
      if ((isVideoJustEnded || this.isVideoPlayedLastTime()) && !isVideoEnded) {
        this.playVideo();
      }
      return;
    }
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
        this.playbackVideoElement = this.videoPlayer();
        this.playbackAudioElement = this.audioPlayer();
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
        untracked(() => {
          if (
            this.previousDashUrl === dashUrl &&
            this.playbackMode() === 'dash'
          ) {
            return;
          }
          this.loadSource(videoId, dashUrl, videoUrl, audioUrl);
        });
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
    this.closeDocumentPictureInPicture?.();
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
    }, NativeYouTubePlayerComponent.hoverAndRestTimeoutMs);
  }

  onMouseLeave() {
    if (this.mini()) {
      return;
    }
    this.isHovered.set(false);
    this.clearHoverTimer();
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
    if (!this.hasSeparateAudio()) {
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
    if (this.hasSeparateAudio()) {
      this.audioPlayer().pause();
    }
  }

  onSeeking() {
    this.isSeeking = true;
    if (this.hasSeparateAudio()) {
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
    if (this.videoPlayer().currentTime < this.duration()) {
      this.isVideoEnded.set(false);
    }
    if (this.isVideoPlaying()) {
      this.playAudio();
    }
  }

  onWaiting() {
    if (this.hasSeparateAudio()) {
      this.audioPlayer().pause();
    }
  }

  onPlaying() {
    this.playAudio();
  }

  onCanPlay() {
    const video = this.videoPlayer();
    if (
      this.playbackDisposed ||
      !this.playbackMode() ||
      video.readyState < video.HAVE_FUTURE_DATA
    ) {
      return;
    }
    this.playbackReady = true;
    if (this.wantsToPlay && video.paused) {
      this.playVideo();
    }
    this.canPlay.emit();
  }

  onMediaError() {
    // dash.js handles media errors and its own recovery before emitting ERROR.
    if (this.playbackMode() === 'direct') {
      this.wantsToPlay = false;
      this.isVideoPlaying.set(false);
      this.audioPlayer().pause();
      this.playbackMode.set(undefined);
      console.error('Error loading video:', this.videoPlayer().error);
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

  toggleMute(event: MouseEvent) {
    if (this.volume() === 0) {
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
    if (event.button !== 0 || this.duration() <= 0) {
      return;
    }
    event.preventDefault();
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
    const pip = (
      this.document.defaultView as DocumentPictureInPictureWindow | null
    )?.documentPictureInPicture;
    if (pip) {
      this.openDocumentPictureInPicture(pip, successCallback);
    } else {
      console.warn(
        'Document Picture-in-Picture is not supported by this browser.',
      );
    }
  }

  private async openDocumentPictureInPicture(
    pip: NonNullable<
      DocumentPictureInPictureWindow['documentPictureInPicture']
    >,
    successCallback?: () => void,
  ) {
    const host = this.hostElementRef.nativeElement as HTMLElement;
    const parent = host.parentNode;
    if (!parent) {
      return;
    }
    const nextSibling = host.nextSibling;
    const wasPlaying = this.isVideoPlaying();
    let pipWindow: Window | undefined;
    let closed = false;
    const mouseMove = (event: MouseEvent) => this.onDocumentMouseMove(event);
    const mouseUp = (event: MouseEvent) => this.onMouseUp(event);
    const pageHide = () => {
      this.pauseVideo();
      close();
    };
    const close = (destroyElement = false) => {
      if (closed) {
        return;
      }
      closed = true;
      NativeYouTubePlayerComponent.documentPictureInPictureSessions.delete(
        this.document,
      );
      this.closeDocumentPictureInPicture = undefined;
      if (pipWindow) {
        pipWindow.removeEventListener('pagehide', pageHide);
        pipWindow.document.removeEventListener('mousemove', mouseMove);
        pipWindow.document.removeEventListener('mouseup', mouseUp);
        // Restore into the cached route even while its DOM is detached.
        parent.insertBefore(
          host,
          nextSibling?.parentNode === parent ? nextSibling : null,
        );
      }
      this.isDocumentPictureInPicture.set(false);
      this.isDraggingProgressBar = false;
      this.isDraggingVolume = false;
      if (destroyElement) {
        this.disposePlayback();
      }
      pipWindow?.close();
    };
    this.closeDocumentPictureInPicture = close;
    NativeYouTubePlayerComponent.documentPictureInPictureSessions.set(
      this.document,
      { close },
    );
    try {
      const video = this.videoPlayer();
      const aspectRatio =
        video.videoWidth > 0 && video.videoHeight > 0
          ? video.videoWidth / video.videoHeight
          : 16 / 9;
      const width = Math.round(Math.min(480, 480 * aspectRatio));
      pipWindow = await pip.requestWindow({
        width,
        height: Math.round(width / aspectRatio),
        disallowReturnToOpener: true,
        preferInitialWindowPlacement: true,
      });
      // A route return, a replacement player, or destruction can cancel a request.
      if (closed || this.playbackDisposed) {
        pipWindow.close();
        return;
      }
      const pipDocument = pipWindow.document;
      pipDocument.title = 'Video player';
      pipDocument.documentElement.lang = this.document.documentElement.lang;
      pipDocument.documentElement.dir = this.document.documentElement.dir;
      pipDocument.documentElement.className =
        this.document.documentElement.className;
      const base = pipDocument.createElement('base');
      base.href = this.document.baseURI;
      pipDocument.head.append(base);
      for (const style of this.document.querySelectorAll(
        'style, link[rel="stylesheet"]',
      )) {
        pipDocument.head.append(style.cloneNode(true));
      }
      pipWindow.addEventListener('pagehide', pageHide, { once: true });
      pipDocument.addEventListener('mousemove', mouseMove);
      pipDocument.addEventListener('mouseup', mouseUp);
      this.isDocumentPictureInPicture.set(true);
      pipDocument.body.append(host);
      this.changeDetectorRef.detectChanges();
      if (wasPlaying) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
      this.onMouseEnter();
      host.focus();
      successCallback?.();
    } catch (error) {
      close();
      console.error('Error entering Document Picture-in-Picture mode:', error);
    }
  }

  onReturnToVideo(event?: MouseEvent) {
    event?.stopPropagation();
    const wasPlaying = this.isVideoPlaying();
    this.document.defaultView?.focus();
    this.closeDocumentPictureInPicture?.();
    this.returnToVideo.emit(wasPlaying);
  }

  onButtonsContainerClick() {
    this.hostElementRef.nativeElement.focus();
  }

  static exitPictureInPicture(document: Document, destroyElement = false) {
    this.documentPictureInPictureSessions.get(document)?.close(destroyElement);
  }

  setVolumeBy(volume: number) {
    const newVolume = Math.max(
      0,
      Math.min(1, +(this.volume() + volume).toFixed(2)),
    );
    this.volume.set(newVolume);
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
  ) {
    if (this.playbackDisposed) {
      return;
    }
    const version = ++this.sourceVersion;
    this.playbackReady = false;
    this.playbackMode.set(undefined);
    this.destroyDashPlayer();
    const video = this.videoPlayer();
    const audio = this.audioPlayer();
    video.pause();
    audio.pause();
    video.removeAttribute('src');
    audio.removeAttribute('src');
    video.load();
    audio.load();
    this.previousDashUrl = dashUrl;
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
      this.loadDashSource(dashUrl, version);
    } else {
      this.loadDirectSource(videoUrl, audioUrl);
    }
  }

  private async loadDashSource(url: string, version: number) {
    try {
      this.playbackMode.set('dash');
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
        for (const preferred of [this.preferredAudioLanguage(), 'en']) {
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
      this.playbackMode() !== 'dash'
    ) {
      return;
    }
    console.warn('DASH playback failed; trying direct media:', error);
    const time = this.pendingSeek?.time ?? this.videoPlayer().currentTime;
    this.pendingSeek = { videoId: this.videoId(), time };
    ++this.sourceVersion;
    this.playbackReady = false;
    this.playbackMode.set(undefined);
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
    this.playbackMode.set('direct');
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
    this.playbackMode.set(undefined);
    this.destroyDashPlayer();
    this.stopProgressTracking();
    const video = this.playbackVideoElement;
    const audio = this.playbackAudioElement;
    for (const media of [video, audio]) {
      if (media) {
        media.pause();
        media.removeAttribute('src');
        media.load();
      }
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
  }

  private playAudio() {
    if (!this.hasSeparateAudio() || !this.wantsToPlay) {
      return;
    }
    this.audioPlayer()
      .play()
      .catch((error: unknown) => {
        console.log('Error playing audio:', error);
      });
  }

  private synchronizeAudioWithVideo() {
    if (this.hasSeparateAudio() && this.audioPlayer().readyState > 0) {
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

      // Keep the drag preview until the user commits the seek on mouseup.
      if (!this.isDraggingProgressBar && this.duration() > 0) {
        const playedFraction = (video.currentTime / this.duration()) * 100;
        this.playedProgress.set(Math.min(100, Math.max(0, playedFraction)));
        this.currentTime.set(video.currentTime);
      }
      // The cached details route is detached from Angular's view tree in PiP.
      if (this.isDocumentPictureInPicture()) {
        this.changeDetectorRef.detectChanges();
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
    if (rect.width <= 0) {
      return;
    }
    const position = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    // Preview immediately without restarting media buffering on every move.
    this.currentTime.set(position * this.duration());
    this.playedProgress.set(position * 100);
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  private clearVolumeKeyboardTimer() {
    if (this.keyboardVolumeTimeout) {
      clearTimeout(this.keyboardVolumeTimeout);
      this.keyboardVolumeTimeout = null;
    }
  }
}
