import {
  CombinedTextIcon,
  CombinedTextIconButtonComponent,
  DropdownButtonComponent,
  FormattedStringComponent,
  IconDirective,
  ISection,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideoDetailsDescriptionComponent } from '../video-details-description/video-details-description.component';

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
    DropdownButtonComponent,
    CombinedTextIconButtonComponent,
    VideoDetailsDescriptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsInfoComponent {
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

  moreItems = signal<ISection[]>([
    {
      sectionItems: [
        {
          iconName: 'downloads-light',
          displayText: 'Download',
        },
        {
          iconName: 'thanks',
          displayText: 'Thanks',
        },
        {
          iconName: 'your-clips-light',
          displayText: 'Clip',
        },
        {
          iconName: 'save-to-playlist',
          displayText: 'Save',
        },
        {
          iconName: 'report-light',
          displayText: 'Report',
        },
      ],
    },
  ]);

  likeDislikeCombinedTextIcons = computed(
    () =>
      <CombinedTextIcon[]>[
        {
          displayText: this.likeCountString(),
          svgIcon: 'dislike',
          transform: 'rotate(180deg)',
        },
        {
          displayText: this.dislikeCountString(),
          svgIcon: 'dislike',
        },
      ],
  );
}
