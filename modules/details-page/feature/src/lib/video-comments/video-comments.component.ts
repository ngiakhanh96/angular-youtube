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
  selectMyChannelInfo,
} from '@angular-youtube/shared-data-access';

import {
  ImageDirective,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
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
    ReactiveFormsModule,
    TextIconButtonComponent,
    VideoCommentComponent,
    ImageDirective,
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
  //TODO implement comment posting and sorting feature
  commentInput = new FormControl('');
  isCommentFocused = signal(false);
  isSortOpen = signal(false);
  selectedSort = signal<CommentSortOption>(CommentSortOption.TopComments);
  sanitizer = inject(DomSanitizer);
  auth = inject(Auth);
  CommentSortOption = CommentSortOption;

  sortChanged = output<CommentSortOption>();
  user = this.selectSignal(selectMyChannelInfo);
  userThumbnail = computed(
    () =>
      this.user()?.items[0].snippet.thumbnails.default.url ??
      'https://yt3.ggpht.com/a/default-user',
  );

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = this.getRepliesCount(comment);
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }

  cancelCommentFocused() {
    this.isCommentFocused.set(false);
    this.commentInput.setValue('');
  }
}
