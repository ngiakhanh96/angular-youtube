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
  currentVideoId = input.required<string>();
  viewCount = input.required<number>();
  publishedDateEpoch = input.required<number>();
  descriptionHtml = input<string>();
  sanitizer = inject(DomSanitizer);
  publishedDate = computed(() =>
    Utilities.epochToDate(this.publishedDateEpoch()),
  );
  publishedDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
  sanitizedDescriptionHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      (this.descriptionHtml() ?? '') === ''
        ? '<p class="text-gray-600 italic">No description has been added to this video. \n\n</p>'
        : this.descriptionHtml()!,
    ),
  );
  DisplayMode = DisplayMode;
  mode = signal(DisplayMode.Less);
  firstLineText = computed(() => {
    const mode = this.mode();
    const viewCount = this.viewCount();
    if (mode === DisplayMode.Less) {
      return `${Utilities.numberToString(viewCount, 'view', 'No')}  ${this.publishedDateString()}`;
    }
    return `${Utilities.numberToStringWithCommas(viewCount)} views  ${Utilities.dateToString(this.publishedDate())}`;
  });

  onExpand(expanded: boolean) {
    if (expanded) {
      this.mode.set(DisplayMode.More);
    } else {
      this.mode.set(DisplayMode.Less);
    }
  }
}
