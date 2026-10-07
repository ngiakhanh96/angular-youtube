import {
  detailsPageEventGroup,
  DetailsPageStore,
} from '@angular-youtube/details-page-data-access';
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
import { Component, computed, inject, input, signal } from '@angular/core';
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
})
export class VideoDetailsInfoComponent extends BaseWithSandBoxComponent {
  detailsPageStore = inject(DetailsPageStore);
  videoInfo = input.required<IVideoDetailsInfo | undefined>();
  commentsInfo = input.required<IInvidiousVideoCommentsInfo | undefined>();
  isLoadingComments = this.sandbox.sharedStore.getIsPendingRequest(
    detailsPageEventGroup.loadYoutubeVideoComments.type,
  );
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
  authorLogoUrl = computed(() =>
    this.videoInfo()?.authorLogoUrl === '' ||
    this.videoInfo()?.authorLogoUrl == null
      ? Utilities.defaultUserAvatarUrl
      : (this.videoInfo()?.authorLogoUrl ?? ''),
  );

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
    if (this.isLoadingComments()) return;

    const commentsInfo = this.commentsInfo();
    if (commentsInfo?.continuation) {
      this.dispatchEvent(
        detailsPageEventGroup.loadYoutubeVideoComments({
          videoId: this.videoInfo()?.id ?? '',
          sortBy: this.detailsPageStore.commentSortBy(),
          continuation: commentsInfo.continuation,
        }),
      );
    }
  }
}
