import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

/**  Quality of the placeholder image.  */
export type PlaceholderImageQuality = 'high' | 'standard' | 'low';

@Component({
  selector: 'ay-youtube-player-placeholder',
  templateUrl: './youtube-player-placeholder.component.html',
  styleUrls: ['./youtube-player-placeholder.component.scss'],
  imports: [TextIconButtonComponent],
  host: {
    '[class.youtube-player-placeholder-loading]': 'isLoading()',
    '[style.background-image]': 'backgroundImageUrl()',
    '[style.borderRadius]': 'borderRadius()',
    '[style.boxShadow]': 'boxShadow()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YouTubePlayerPlaceholderComponent {
  showPlayButton = input(true);
  playButtonIconWidthHeight = input('48px');
  playButtonIconViewBox = input('0 0 68 48');

  /** ID of the video for which to show the placeholder. */
  videoId = input.required<string>();

  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');

  borderRadius = input<string>('12px');

  /** Whether the video is currently being loaded. */
  isLoading = input.required<boolean>();

  /** Accessible label for the play button. */
  buttonLabel = input.required<string>();

  /** Quality of the placeholder image. */
  quality = input.required<PlaceholderImageQuality>();

  /** Gets the background image showing the placeholder. */
  backgroundImageUrl = computed(() => {
    let url: string;
    if (this.quality() === 'low') {
      url = `https://i.ytimg.com/vi/${this.videoId()}/hqdefault.jpg`;
    } else if (this.quality() === 'high') {
      url = `https://i.ytimg.com/vi/${this.videoId()}/maxresdefault.jpg`;
    } else {
      url = `https://i.ytimg.com/vi_webp/${this.videoId()}/sddefault.webp`;
    }

    return `url(${url})`;
  });
}
