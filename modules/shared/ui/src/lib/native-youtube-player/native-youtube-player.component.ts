/// <reference types="youtube" />
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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

//TODO support feature unhover pause and display placeholders
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
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeYouTubePlayerComponent {
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
  viewMode = model<ViewMode>(ViewMode.Theater);
  ViewMode = ViewMode;
  screenMode = signal<ScreenMode>(ScreenMode.Default);
  ScreenMode = ScreenMode;
  playerClick = output<HTMLMediaElement>();
  nextVideo = output<boolean>();
  /** The element that will be replaced by the iframe. */
  private readonly document = inject(DOCUMENT);

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
        const videoUrl = this.videoUrl();
        this.videoPlayer()?.load();
        if (!this.autoPlay()) {
          this.videoPlayer().muted = true;
        } else {
          //TODO remove this when finish details page
          this.videoPlayer().muted = true;
          this.playVideo();
        }
      },
    });
  }

  playVideo() {
    this.videoPlayer()
      .play()
      .then((_) => {
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

  toggleFullScreen() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen().then(() => {
        this.screenMode.set(ScreenMode.Default);
      });
    } else {
      const element = this.videoPlayerContainerRef().nativeElement;
      element.requestFullscreen().then(() => {
        this.screenMode.set(ScreenMode.Full);
      });
    }
  }
}
