/// <reference types="youtube" />
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  PlaceholderImageQuality,
  YouTubePlayerPlaceholderComponent,
} from '../youtube-player-placeholder/youtube-player-placeholder.component';

/**
 * Angular component that renders a YouTube player via the YouTube player
 * iframe API.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
//TODO support feature unhover pause and display placeholders
@Component({
  selector: 'ay-native-youtube-player',
  encapsulation: ViewEncapsulation.None,
  imports: [YouTubePlayerPlaceholderComponent],
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

  videoContainer =
    viewChild.required<ElementRef<HTMLMediaElement>>('videoContainer');

  videoPlayer = computed(() => this.videoContainer().nativeElement);

  showPlayButton = input(false);

  isVideoPlayed = signal(false);
  autoPlay = input<boolean>(false);

  playerClick = output<HTMLMediaElement>();
  /** The element that will be replaced by the iframe. */
  constructor() {
    afterNextRender(() => {
      if (!this.autoPlay()) {
        this.videoPlayer().muted = true;
      } else {
        this.playVideo();
      }
      this.videoPlayer().addEventListener('click', () => {
        this.playerClick.emit(this.videoPlayer());
      });
    });
  }

  playVideo() {
    this.videoPlayer().play();
    this.isVideoPlayed.set(true);
  }

  pauseVideo() {
    this.videoPlayer().pause();
    this.isVideoPlayed.set(false);
  }

  toggleVideo() {
    if (this.isVideoPlayed()) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }
}
