import { CardComponent, Utilities } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export enum DisplayMode {
  More = 'More',
  Less = 'Less',
}

@Component({
  selector: 'ay-video-details-description',
  templateUrl: './video-details-description.component.html',
  styleUrls: ['./video-details-description.component.scss'],
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsDescriptionComponent {
  viewCount = input.required<number>();
  publishedDateEpoch = input.required<number>();
  publishedDateText = input.required<string>();
  descriptionHtml = input<string>();
  sanitizer = inject(DomSanitizer);
  sanitizedDescriptionHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.descriptionHtml() ?? ''),
  );
  DisplayMode = DisplayMode;
  mode = signal(DisplayMode.Less);
  firstLineText = computed(() => {
    const mode = this.mode();
    const viewCount = this.viewCount();
    const publishedDateText = this.publishedDateText();
    const publishedDateEpoch = this.publishedDateEpoch();
    if (mode === DisplayMode.Less) {
      return `${Utilities.numberToString(viewCount, 'view')}  ${publishedDateText}`;
    }
    return `${viewCount} views  ${publishedDateEpoch}`;
  });
}
