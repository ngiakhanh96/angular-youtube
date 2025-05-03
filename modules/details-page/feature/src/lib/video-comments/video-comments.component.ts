import {
  detailsPageActionGroup,
  selectNestedVideoCommentsInfoByCommentId,
} from '@angular-youtube/details-page-data-access';
import {
  IVideoCommentViewModel,
  VideoCommentComponent,
} from '@angular-youtube/details-page-ui';
import {
  Auth,
  BaseWithSandBoxComponent,
  IInvidiousVideoCommentsInfo,
  IVideoComment,
} from '@angular-youtube/shared-data-access';

import { TextIconButtonComponent } from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';

export enum CommentSortOption {
  TopComments = 'Top comments',
  NewestFirst = 'Newest first',
}

@Component({
  selector: 'ay-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    TextIconButtonComponent,
    VideoCommentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCommentsComponent extends BaseWithSandBoxComponent {
  commentsInfo = input.required<IInvidiousVideoCommentsInfo | undefined>();
  videoId = computed(() => this.commentsInfo()?.videoId ?? '');
  comments = computed(() => this.commentsInfo()?.comments ?? []);
  repliesFn = (comment: IVideoComment, continuation?: string) => {
    this.dispatchAction(
      detailsPageActionGroup.loadYoutubeVideoComments({
        videoId: this.videoId(),
        continuation: continuation ?? comment.replies?.continuation,
        commentId: comment.commentId,
      }),
    );
    return this.select(
      selectNestedVideoCommentsInfoByCommentId(comment.commentId),
    ).pipe(
      map((nestedCommentsInfo) => {
        return {
          comments: nestedCommentsInfo?.comments.map((comment) => {
            return {
              comment,
              videoId: this.videoId(),
              repliesFn: this.repliesFn,
            };
          }),
          continuation: nestedCommentsInfo?.continuation,
        };
      }),
    );
  };
  commentViewModels = computed<IVideoCommentViewModel[]>(() => {
    return this.comments().map((comment) => {
      return {
        comment,
        videoId: this.videoId(),
        repliesFn: this.repliesFn,
      };
    });
  });
  totalCommentsString = computed(() => {
    const totalComments = this.commentsInfo()?.commentCount ?? 0;
    return `${totalComments} Comment${totalComments > 1 ? 's' : ''}`;
  });
  commentInput = new FormControl('');
  isCommentFocused = signal(false);
  isSortOpen = signal(false);
  selectedSort = signal<CommentSortOption>(CommentSortOption.TopComments);
  sanitizer = inject(DomSanitizer);
  auth = inject(Auth);
  CommentSortOption = CommentSortOption;

  sortChanged = output<CommentSortOption>();

  // TODO: Replace with actual user avatar from auth service
  userAvatar = signal('https://yt3.ggpht.com/ytc/default_avatar');

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = this.getRepliesCount(comment);
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }
}
