import { detailsPageActionGroup } from '@angular-youtube/details-page-data-access';
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
  ISection,
  TextIconButtonComponent,
  TextRenderComponent,
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
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
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
    NgOptimizedImage,
    TextRenderComponent,
    TextIconButtonComponent,
    DropdownButtonComponent,
    CombinedTextIconButtonComponent,
    VideoDetailsDescriptionComponent,
    ChannelNameComponent,
    VideoCommentsComponent,
    InfiniteScrollDirective,
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

  onScrollDown() {
    if (this.commentsInfo()?.continuation) {
      this.dispatchAction(
        detailsPageActionGroup.loadYoutubeVideoComments({
          videoId: this.videoInfo()?.id ?? '',
          continuation: this.commentsInfo()?.continuation,
        }),
      );
    }
  }
}
