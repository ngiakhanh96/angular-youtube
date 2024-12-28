import {
  FormattedStringComponent,
  IconDirective,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export interface IVideoDetailsInfo {
  title: string;
  authorLogoUrl: string;
  author: string;
  authorVerified: boolean;
  subscriberCountText: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  descriptionHtml: string;
  publishedDateEpoch: number;
  publishedDateText: string;
}

@Component({
  selector: 'ay-video-details-info',
  templateUrl: './video-details-info.component.html',
  styleUrls: ['./video-details-info.component.scss'],
  imports: [
    NgOptimizedImage,
    FormattedStringComponent,
    MatIconModule,
    IconDirective,
    TextIconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsInfoComponent {
  sanitizer = inject(DomSanitizer);
  videoInfo = input.required<IVideoDetailsInfo | undefined>();
  likeCountString = computed(() => {
    const videoInfo = this.videoInfo();
    return Utilities.numberToString(videoInfo?.likeCount ?? 0);
  });
  viewCountString = computed(() => {
    const videoInfo = this.videoInfo();
    return Utilities.numberToString(videoInfo?.viewCount ?? 0);
  });
  dislikeCountString = computed(() => {
    const videoInfo = this.videoInfo();
    return Utilities.numberToString(videoInfo?.dislikeCount ?? 0);
  });
  descriptionHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      this.videoInfo()?.descriptionHtml ?? '',
    ),
  );
}
