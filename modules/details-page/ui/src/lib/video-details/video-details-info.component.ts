import { VideoTitleComponent } from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface IVideoDetailsInfo {
  title: string;
  authorLogoUrl: string;
  author: string;
  subscriberCountText: string;
  likeCount: number;
  viewCount: number;
  descriptionHtml: string;
  publishedDateEpoch: number;
  publishedDateText: string;
}

@Component({
  selector: 'ay-video-details-info',
  templateUrl: './video-details-info.component.html',
  styleUrls: ['./video-details-info.component.scss'],
  imports: [NgOptimizedImage, VideoTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsInfoComponent {
  sanitizer = inject(DomSanitizer);
  videoInfo = input.required<IVideoDetailsInfo | undefined>();
  descriptionHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      this.videoInfo()?.descriptionHtml ?? '',
    ),
  );
}
