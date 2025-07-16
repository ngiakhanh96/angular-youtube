import { detailsPageEventGroup } from '@angular-youtube/details-page-data-access';
import { VideoDetailsDescriptionComponent } from '@angular-youtube/details-page-ui';
import {
  BaseWithSandBoxComponent,
  IInvidiousVideoCommentsInfo,
} from '@angular-youtube/shared-data-access';
import {
  ChannelNameComponent,
  CombinedTextIcon,
  CombinedTextIconButtonComponent,
  DropdownButtonComponent,
  ImageDirective,
  InfiniteScrollDirective,
  ISection,
  TextIconButtonComponent,
  TextRenderComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { VideoCommentsComponent } from '../video-comments/video-comments.component';

export interface IVideoDetailsInfo {
  id: string;
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
}

@Component({
  selector: 'ay-video-details-info',
  templateUrl: './video-details-info.component.html',
  styleUrls: ['./video-details-info.component.scss'],
  imports: [
    TextRenderComponent,
    TextIconButtonComponent,
    DropdownButtonComponent,
    CombinedTextIconButtonComponent,
    VideoDetailsDescriptionComponent,
    ChannelNameComponent,
    VideoCommentsComponent,
    InfiniteScrollDirective,
    ImageDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsInfoComponent extends BaseWithSandBoxComponent {
  videoInfo = input.required<IVideoDetailsInfo | undefined>();
  commentsInfo = input.required<IInvidiousVideoCommentsInfo | undefined>();
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
          displayHtml: 'Download',
        },
        {
          iconName: 'thanks',
          displayHtml: 'Thanks',
        },
        {
          iconName: 'your-clips-light',
          displayHtml: 'Clip',
        },
        {
          iconName: 'save-to-playlist',
          displayHtml: 'Save',
        },
        {
          iconName: 'report-light',
          displayHtml: 'Report',
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

  onScrollDown() {
    if (this.commentsInfo()?.continuation) {
      this.dispatchEvent(
        detailsPageEventGroup.loadYoutubeVideoComments({
          videoId: this.videoInfo()?.id ?? '',
          continuation: this.commentsInfo()?.continuation,
        }),
      );
    }
  }
}
