import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '../svg-button-renderer/svg-button-renderer.component';

/**  Quality of the placeholder image.  */
export type PlaceholderImageQuality = 'high' | 'standard' | 'low';

@Component({
  selector: 'ay-youtube-player-placeholder',
  templateUrl: './youtube-player-placeholder.component.html',
  styleUrls: ['./youtube-player-placeholder.component.scss'],
  imports: [SvgButtonRendererComponent, SvgButtonTemplateDirective],
  host: {
    '[class.youtube-player-placeholder-loading]': 'isLoading()',
    '[style.background-image]': 'backgroundImageUrl()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.borderRadius]': 'borderRadius()',
    '[style.boxShadow]': 'boxShadow()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YouTubePlayerPlaceholderComponent {
  /** ID of the video for which to show the placeholder. */
  videoId = input.required<string>();

  /** Width of the video for which to show the placeholder. */
  width = input<string>('100%');

  /** Height of the video for which to show the placeholder. */
  height = input<string>('100%');

  borderRadius = input<string>('12px');

  /** Whether the video is currently being loaded. */
  isLoading = input.required<boolean>();

  /** Accessible label for the play button. */
  buttonLabel = input.required<string>();

  /** Quality of the placeholder image. */
  quality = input.required<PlaceholderImageQuality>();

  boxShadow = input<string>('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');

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

  showPlayButton = input(true);
}
