/// <reference types="youtube" />
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  CSP_NONCE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  isDevMode,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  Subject,
  fromEventPattern,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  PlaceholderImageQuality,
  YouTubePlayerPlaceholderComponent,
} from '../youtube-player-placeholder/youtube-player-placeholder.component';

declare global {
  interface Window {
    YT: typeof YT | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

/** Injection token used to configure the `YouTubePlayer`. */
export const YOUTUBE_PLAYER_CONFIG = new InjectionToken<YouTubePlayerConfig>(
  'YOUTUBE_PLAYER_CONFIG'
);

/** Object that can be used to configure the `YouTubePlayer`. */
export interface YouTubePlayerConfig {
  /** Whether to load the YouTube iframe API automatically. Defaults to `true`. */
  loadApi?: boolean;

  /**
   * By default the player shows a placeholder image instead of loading the YouTube API which
   * improves the initial page load performance. Use this option to disable the placeholder loading
   * behavior globally. Defaults to `false`.
   */
  disablePlaceholder?: boolean;

  /** Accessible label for the play button inside of the placeholder. */
  placeholderButtonLabel?: string;

  /**
   * Quality of the displayed placeholder image. Defaults to `standard`,
   * because not all video have a high-quality placeholder.
   */
  placeholderImageQuality?: PlaceholderImageQuality;
}

export const DEFAULT_PLAYER_WIDTH = 640;
export const DEFAULT_PLAYER_HEIGHT = 390;

/**
 * Object used to store the state of the player if the
 * user tries to interact with the API before it has been loaded.
 */
interface PendingPlayerState {
  playbackState?: PlayerState.PLAYING | PlayerState.PAUSED | PlayerState.CUED;
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
  seek?: { seconds: number; allowSeekAhead: boolean };
}

/** Coercion function for time values. */
function coerceTime(value: number | undefined): number | undefined {
  return value == null ? value : numberAttribute(value, 0);
}

/**
 * Equivalent of `YT.PlayerState` which we can't use, because it's meant to
 * be read off the `window` which we can't do before the API has been loaded.
 */
enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

/**
 * Angular component that renders a YouTube player via the YouTube player
 * iframe API.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
@Component({
  selector: 'ay-youtube-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [YouTubePlayerPlaceholderComponent],
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
})
export class YouTubePlayerComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  /** Whether we're currently rendering inside a browser. */
  private readonly _isBrowser: boolean;
  private _player: YT.Player | undefined;
  private _pendingPlayer: YT.Player | undefined;
  private _existingApiReadyCallback: (() => void) | undefined;
  private _pendingPlayerState: PendingPlayerState | undefined;
  private readonly _destroyed = new Subject<void>();
  private readonly _playerChanges = new BehaviorSubject<YT.Player | undefined>(
    undefined
  );
  private readonly _nonce = inject(CSP_NONCE, { optional: true });
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  protected _isLoading = false;
  protected _hasPlaceholder = true;

  /** YouTube Video ID to view */
  videoId = input.required<string>();

  /** Height of video player */
  height = input<string>('100%');

  /** Width of video player */
  width = input<string>('100%');

  /** The moment when the player is supposed to start playing */
  startSeconds = input(undefined, { transform: coerceTime });

  /** The moment when the player is supposed to stop playing */
  endSeconds = input(undefined, { transform: coerceTime });

  /** The suggested quality of the player */
  suggestedQuality = input<YT.SuggestedVideoQuality>();

  /**
   * Extra parameters used to configure the player. See:
   * https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5#Parameters
   */
  playerVars = input<YT.PlayerVars>();

  /** Whether cookies inside the player have been disabled. */
  disableCookies = input(false, { transform: booleanAttribute });

  /** Whether to automatically load the YouTube iframe API. Defaults to `true`. */
  loadApi = input(true, { transform: booleanAttribute });

  /**
   * By default the player shows a placeholder image instead of loading the YouTube API which
   * improves the initial page load performance. This input allows for the behavior to be disabled.
   */
  disablePlaceholder = input(false, { transform: booleanAttribute });

  /**
   * Whether the iframe will attempt to load regardless of the status of the api on the
   * page. Set this to true if you don't want the `onYouTubeIframeAPIReady` field to be
   * set on the global window.
   */
  showBeforeIframeApiLoads = input(false, { transform: booleanAttribute });

  /** Accessible label for the play button inside of the placeholder. */
  placeholderButtonLabel = input<string>('Play video');

  /**
   * Quality of the displayed placeholder image. Defaults to `standard`,
   * because not all video have a high-quality placeholder.
   */
  placeholderImageQuality = input<PlaceholderImageQuality>('standard');

  showPlayButton = input(true);

  /** Outputs are direct proxies from the player itself. */
  readonly ready = outputFromObservable(
    this._getLazyEmitter<YT.PlayerEvent>('onReady')
  );

  readonly stateChange = outputFromObservable(
    this._getLazyEmitter<YT.OnStateChangeEvent>('onStateChange')
  );

  readonly errorThrown = outputFromObservable(
    this._getLazyEmitter<YT.OnErrorEvent>('onError')
  );

  readonly apiChange = outputFromObservable(
    this._getLazyEmitter<YT.PlayerEvent>('onApiChange')
  );

  readonly playbackQualityChange = outputFromObservable(
    this._getLazyEmitter<YT.OnPlaybackQualityChangeEvent>(
      'onPlaybackQualityChange'
    )
  );

  readonly playbackRateChange = outputFromObservable(
    this._getLazyEmitter<YT.OnPlaybackRateChangeEvent>('onPlaybackRateChange')
  );

  /** The element that will be replaced by the iframe. */
  youtubeContainer =
    viewChild.required<ElementRef<HTMLElement>>('youtubeContainer');

  finalLoadApi = signal<boolean | undefined>(undefined);
  finalDisablePlaceholder = signal<boolean | undefined>(false);
  finalPlaceholderButtonLabel = signal<string>('');
  finalPlaceholderImageQuality = signal<PlaceholderImageQuality>('high');
  private _ngZone = inject(NgZone);
  platformId = inject(PLATFORM_ID);
  constructor() {
    const config = inject(YOUTUBE_PLAYER_CONFIG, { optional: true });
    this.finalLoadApi.set(config?.loadApi ?? this.loadApi());
    this.finalDisablePlaceholder.set(
      config?.disablePlaceholder ?? this.disablePlaceholder()
    );
    this.finalPlaceholderButtonLabel.set(
      config?.placeholderButtonLabel ?? this.placeholderButtonLabel()
    );
    this.finalPlaceholderImageQuality.set(
      config?.placeholderImageQuality ?? this.placeholderImageQuality()
    );
    this._isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    this._conditionallyLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._shouldRecreatePlayer(changes)) {
      this._conditionallyLoad();
    } else if (this._player) {
      if (changes['width'] || changes['height']) {
        this._setSize();
      }

      if (changes['suggestedQuality']) {
        this._setQuality();
      }

      if (
        changes['startSeconds'] ||
        changes['endSeconds'] ||
        changes['suggestedQuality']
      ) {
        this._cuePlayer();
      }
    }
  }

  ngOnDestroy() {
    this._pendingPlayer?.destroy();

    if (this._player) {
      this._player.destroy();
      window.onYouTubeIframeAPIReady = this._existingApiReadyCallback;
    }

    this._playerChanges.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#playVideo */
  playVideo() {
    if (this._player) {
      this._player.playVideo();
    } else {
      this._getPendingState().playbackState = PlayerState.PLAYING;
      this._load(true);
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#pauseVideo */
  pauseVideo() {
    if (this._player) {
      this._player.pauseVideo();
    } else {
      this._getPendingState().playbackState = PlayerState.PAUSED;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#stopVideo */
  stopVideo() {
    if (this._player) {
      this._player.stopVideo();
    } else {
      // It seems like YouTube sets the player to CUED when it's stopped.
      this._getPendingState().playbackState = PlayerState.CUED;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#seekTo */
  seekTo(seconds: number, allowSeekAhead: boolean) {
    if (this._player) {
      this._player.seekTo(seconds, allowSeekAhead);
    } else {
      this._getPendingState().seek = { seconds, allowSeekAhead };
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#mute */
  mute() {
    if (this._player) {
      this._player.mute();
    } else {
      this._getPendingState().muted = true;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#unMute */
  unMute() {
    if (this._player) {
      this._player.unMute();
    } else {
      this._getPendingState().muted = false;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#isMuted */
  isMuted(): boolean {
    if (this._player) {
      return this._player.isMuted();
    }

    if (this._pendingPlayerState) {
      return !!this._pendingPlayerState.muted;
    }

    return false;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#setVolume */
  setVolume(volume: number) {
    if (this._player) {
      this._player.setVolume(volume);
    } else {
      this._getPendingState().volume = volume;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getVolume */
  getVolume(): number {
    if (this._player) {
      return this._player.getVolume();
    }

    if (this._pendingPlayerState && this._pendingPlayerState.volume != null) {
      return this._pendingPlayerState.volume;
    }

    return 0;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate */
  setPlaybackRate(playbackRate: number) {
    if (this._player) {
      return this._player.setPlaybackRate(playbackRate);
    } else {
      this._getPendingState().playbackRate = playbackRate;
    }
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackRate */
  getPlaybackRate(): number {
    if (this._player) {
      return this._player.getPlaybackRate();
    }

    if (
      this._pendingPlayerState &&
      this._pendingPlayerState.playbackRate != null
    ) {
      return this._pendingPlayerState.playbackRate;
    }

    return 0;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getAvailablePlaybackRates */
  getAvailablePlaybackRates(): number[] {
    return this._player ? this._player.getAvailablePlaybackRates() : [];
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoLoadedFraction */
  getVideoLoadedFraction(): number {
    return this._player ? this._player.getVideoLoadedFraction() : 0;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getPlayerState */
  getPlayerState(): YT.PlayerState | undefined {
    if (!this._isBrowser || !window.YT) {
      return undefined;
    }

    if (this._player) {
      return this._player.getPlayerState();
    }

    if (
      this._pendingPlayerState &&
      this._pendingPlayerState.playbackState != null
    ) {
      return this._pendingPlayerState.playbackState;
    }

    return PlayerState.UNSTARTED;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getCurrentTime */
  getCurrentTime(): number {
    if (this._player) {
      return this._player.getCurrentTime();
    }

    if (this._pendingPlayerState && this._pendingPlayerState.seek) {
      return this._pendingPlayerState.seek.seconds;
    }

    return 0;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackQuality */
  getPlaybackQuality(): YT.SuggestedVideoQuality {
    return this._player ? this._player.getPlaybackQuality() : 'default';
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getAvailableQualityLevels */
  getAvailableQualityLevels(): YT.SuggestedVideoQuality[] {
    return this._player ? this._player.getAvailableQualityLevels() : [];
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getDuration */
  getDuration(): number {
    return this._player ? this._player.getDuration() : 0;
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoUrl */
  getVideoUrl(): string {
    return this._player ? this._player.getVideoUrl() : '';
  }

  /** See https://developers.google.com/youtube/iframe_api_reference#getVideoEmbedCode */
  getVideoEmbedCode(): string {
    return this._player ? this._player.getVideoEmbedCode() : '';
  }

  /**
   * Loads the YouTube API and sets up the player.
   * @param playVideo Whether to automatically play the video once the player is loaded.
   */
  protected _load(playVideo: boolean) {
    // Don't do anything if we're not in a browser environment.
    if (!this._isBrowser) {
      return;
    }

    if (!window.YT || !window.YT.Player) {
      if (this.loadApi()) {
        this._isLoading = true;
        loadApi(this._nonce);
      } else if (this.showBeforeIframeApiLoads() && isDevMode()) {
        throw new Error(
          'Namespace YT not found, cannot construct embedded youtube player. ' +
            'Please install the YouTube Player API Reference for iframe Embeds: ' +
            'https://developers.google.com/youtube/iframe_api_reference'
        );
      }

      this._existingApiReadyCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        this._existingApiReadyCallback?.();
        this._ngZone.run(() => this._createPlayer(playVideo));
      };
    } else {
      this._createPlayer(playVideo);
    }
  }

  /** Loads the player depending on the internal state of the component. */
  private _conditionallyLoad() {
    // If the placeholder isn't shown anymore, we have to trigger a load.
    if (!this._shouldShowPlaceholder()) {
      this._load(false);
    } else if (this.playerVars()?.autoplay === 1) {
      // If it's an autoplaying video, we have to hide the placeholder and start playing.
      this._load(true);
    }
  }

  /** Whether to show the placeholder element. */
  protected _shouldShowPlaceholder(): boolean {
    if (this.disablePlaceholder()) {
      return false;
    }

    // Since we don't load the API on the server, we show the placeholder permanently.
    if (!this._isBrowser) {
      return true;
    }

    return this._hasPlaceholder && !!this.videoId() && !this._player;
  }

  /** Gets an object that should be used to store the temporary API state. */
  private _getPendingState(): PendingPlayerState {
    if (!this._pendingPlayerState) {
      this._pendingPlayerState = {};
    }

    return this._pendingPlayerState;
  }

  /**
   * Determines whether a change in the component state
   * requires the YouTube player to be recreated.
   */
  private _shouldRecreatePlayer(changes: SimpleChanges): boolean {
    const change =
      changes['videoId'] ||
      changes['playerVars'] ||
      changes['disableCookies'] ||
      changes['disablePlaceholder'];
    return !!change && !change.isFirstChange();
  }

  /**
   * Creates a new YouTube player and destroys the existing one.
   * @param playVideo Whether to play the video once it loads.
   */
  private _createPlayer(playVideo: boolean) {
    this._player?.destroy();
    this._pendingPlayer?.destroy();

    // A player can't be created if the API isn't loaded,
    // or there isn't a video or playlist to be played.
    if (
      typeof YT === 'undefined' ||
      (!this.videoId() && !this.playerVars()?.list)
    ) {
      return;
    }

    // Important! We need to create the Player object outside of the `NgZone`, because it kicks
    // off a 250ms setInterval which will continually trigger change detection if we don't.
    const player = this._ngZone.runOutsideAngular(() => {
      return new YT.Player(this.youtubeContainer().nativeElement, {
        videoId: this.videoId(),
        host: this.disableCookies()
          ? 'https://www.youtube-nocookie.com'
          : undefined,
        width: this.width(),
        height: this.height(),
        // Calling `playVideo` on load doesn't appear to actually play
        // the video so we need to trigger it through `playerVars` instead.
        playerVars: playVideo
          ? { ...(this.playerVars() || {}), autoplay: 1 }
          : this.playerVars(),
      });
    });

    const whenReady = () => {
      // Only assign the player once it's ready, otherwise YouTube doesn't expose some APIs.
      this._ngZone.run(() => {
        this._isLoading = false;
        this._hasPlaceholder = false;
        this._player = player;
        this._pendingPlayer = undefined;
        player.removeEventListener('onReady', whenReady);
        this._playerChanges.next(player);
        this._setSize();
        this._setQuality();

        if (this._pendingPlayerState) {
          this._applyPendingPlayerState(player, this._pendingPlayerState);
          this._pendingPlayerState = undefined;
        }

        // Only cue the player when it either hasn't started yet or it's cued,
        // otherwise cuing it can interrupt a player with autoplay enabled.
        const state = player.getPlayerState();
        if (
          state === PlayerState.UNSTARTED ||
          state === PlayerState.CUED ||
          state == null
        ) {
          this._cuePlayer();
        }

        this._changeDetectorRef.markForCheck();
      });
    };

    this._pendingPlayer = player;
    player.addEventListener('onReady', whenReady);
  }

  /** Applies any state that changed before the player was initialized. */
  private _applyPendingPlayerState(
    player: YT.Player,
    pendingState: PendingPlayerState
  ): void {
    const { playbackState, playbackRate, volume, muted, seek } = pendingState;

    switch (playbackState) {
      case PlayerState.PLAYING:
        player.playVideo();
        break;
      case PlayerState.PAUSED:
        player.pauseVideo();
        break;
      case PlayerState.CUED:
        player.stopVideo();
        break;
    }

    if (playbackRate != null) {
      player.setPlaybackRate(playbackRate);
    }

    if (volume != null) {
      player.setVolume(volume);
    }

    if (muted != null) {
      muted ? player.mute() : player.unMute();
    }

    if (seek != null) {
      player.seekTo(seek.seconds, seek.allowSeekAhead);
    }
  }

  /** Cues the player based on the current component state. */
  private _cuePlayer() {
    if (this._player && this.videoId()) {
      this._player.cueVideoById({
        videoId: this.videoId(),
        startSeconds: this.startSeconds(),
        endSeconds: this.endSeconds(),
        suggestedQuality: this.suggestedQuality(),
      });
    }
  }

  /** Sets the player's size based on the current input values. */
  private _setSize() {
    this._player?.setSize(
      this.width() as unknown as number,
      this.height() as unknown as number
    );
  }

  /** Sets the player's quality based on the current input values. */
  private _setQuality() {
    const suggestedQuality = this.suggestedQuality();
    if (this._player && suggestedQuality) {
      this._player.setPlaybackQuality(suggestedQuality);
    }
  }

  /** Gets an observable that adds an event listener to the player when a user subscribes to it. */
  private _getLazyEmitter<T extends YT.PlayerEvent>(
    name: keyof YT.Events
  ): Observable<T> {
    // Start with the stream of players. This way the events will be transferred
    // over to the new player if it gets swapped out under-the-hood.
    return this._playerChanges.pipe(
      // Switch to the bound event. `switchMap` ensures that the old event is removed when the
      // player is changed. If there's no player, return an observable that never emits.
      switchMap((player) => {
        return player
          ? fromEventPattern<T>(
              (listener: (event: T) => void) => {
                player.addEventListener(
                  name,
                  listener as (event: YT.PlayerEvent) => void
                );
              },
              (listener: (event: T) => void) => {
                // The API seems to throw when we try to unbind from a destroyed player and it doesn't
                // expose whether the player has been destroyed so we have to wrap it in a try/catch to
                // prevent the entire stream from erroring out.
                try {
                  player?.removeEventListener?.(
                    name,
                    listener as (event: YT.PlayerEvent) => void
                  );
                } catch {
                  /* empty */
                }
              }
            )
          : of();
      }),
      // By default we run all the API interactions outside the zone
      // so we have to bring the events back in manually when they emit.
      (source) =>
        new Observable<T>((observer) =>
          source.subscribe({
            next: (value) => this._ngZone.run(() => observer.next(value)),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          })
        ),
      // Ensures that everything is cleared out on destroy.
      takeUntil(this._destroyed)
    );
  }
}

let apiLoaded = false;

/** Loads the YouTube API from a specified URL only once. */
function loadApi(nonce: string | null): void {
  if (apiLoaded) {
    return;
  }

  // We can use `document` directly here, because this logic doesn't run outside the browser.
  const url = 'https://www.youtube.com/iframe_api';
  const script = document.createElement('script');
  const callback = (event: Event) => {
    script.removeEventListener('load', callback);
    script.removeEventListener('error', callback);

    if (event.type === 'error') {
      apiLoaded = false;

      if (isDevMode()) {
        console.error(`Failed to load YouTube API from ${url}`);
      }
    }
  };
  script.addEventListener('load', callback);
  script.addEventListener('error', callback);
  (script as any).src = url;
  script.async = true;

  if (nonce) {
    script.setAttribute('nonce', nonce);
  }

  // Set this immediately to true so we don't start loading another script
  // while this one is pending. If loading fails, we'll flip it back to false.
  apiLoaded = true;
  document.body.appendChild(script);
}
