import {
  detailsPageEventGroup,
  DetailsPageStore,
} from '@angular-youtube/details-page-data-access';
import {
  IVideoCommentViewModel,
  VideoCommentComponent,
} from '@angular-youtube/details-page-ui';
import {
  Auth,
  BaseWithSandBoxComponent,
  HttpResponseStatus,
  IInvidiousVideoCommentsInfo,
  IVideoComment,
} from '@angular-youtube/shared-data-access';

import {
  ImageDirective,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, first, map } from 'rxjs';

export enum CommentSortOption {
  TopComments = 'Top comments',
  NewestFirst = 'Newest first',
}

@Component({
  selector: 'ay-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.scss'],
  imports: [
    ReactiveFormsModule,
    TextIconButtonComponent,
    VideoCommentComponent,
    ImageDirective,
  ],
})
export class VideoCommentsComponent extends BaseWithSandBoxComponent {
  detailsPageStore = inject(DetailsPageStore);
  commentsInfo = input.required<IInvidiousVideoCommentsInfo | undefined>();
  videoId = computed(() => this.commentsInfo()?.videoId ?? '');
  channelId = computed(() => {
    const videoInfo = this.detailsPageStore.videoInfo();
    return videoInfo?.authorId ?? '';
  });
  comments = computed(() => this.commentsInfo()?.comments ?? []);
  repliesFn = (comment: IVideoComment, continuation?: string) => {
    this.dispatchEvent(
      detailsPageEventGroup.loadYoutubeVideoComments({
        videoId: this.videoId(),
        continuation: continuation ?? comment.replies?.continuation,
        commentId: comment.commentId,
      }),
    );
    return this.detailsPageStore
      .getNestedVideoCommentsInfoByCommentId$(comment.commentId, {
        injector: this.injector,
      })
      .pipe(
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
    return `${Utilities.numberToStringWithCommas(totalComments)} Comment${totalComments > 1 ? 's' : ''}`;
  });
  // TODO implement sorting feature
  commentInput = new FormControl('', { nonNullable: true });
  isSubmitting = signal(false);
  submissionError = signal('');
  commentInputElement = viewChild<ElementRef<HTMLInputElement>>(
    'commentInputElement',
  );
  isCommentFocused = signal(false);
  isSortOpen = signal(false);
  selectedSort = signal<CommentSortOption>(CommentSortOption.TopComments);
  sanitizer = inject(DomSanitizer);
  auth = inject(Auth);
  CommentSortOption = CommentSortOption;

  sortChanged = output<CommentSortOption>();
  user = this.sandbox.sharedStore.myChannelInfo;
  userThumbnail = computed(
    () =>
      this.user()?.items[0]?.snippet.thumbnails.default.url ??
      Utilities.defaultUserAvatarUrl,
  );

  constructor() {
    super();
    effect(() => {
      this.videoId();
      this.commentInput.setValue('');
      this.isCommentFocused.set(false);
      this.submissionError.set('');
    });
  }

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = this.getRepliesCount(comment);
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }

  cancelComment() {
    if (this.isSubmitting()) return;
    this.isCommentFocused.set(false);
    this.commentInput.setValue('');
    this.submissionError.set('');
  }

  submitComment() {
    const text = this.commentInput.value.trim();
    const videoId = this.videoId();
    const channelId = this.channelId();
    if (
      this.isSubmitting() ||
      !text ||
      !videoId ||
      !channelId ||
      !this.auth.isLoggedIn() ||
      !this.user()?.items.length
    ) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionError.set('');
    const event = detailsPageEventGroup.postYoutubeVideoComment({
      videoId,
      channelId,
      text,
    });
    this.sandbox.dispatchEvent(event);
    this.sandbox
      .getResponseDetailsSignal(event)
      .pipe(
        first(
          (details) =>
            !!details && details.status !== HttpResponseStatus.Pending,
        ),
        this.takeUntilDestroyed(),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe((details) => {
        if (details.status === HttpResponseStatus.Success) {
          this.commentInput.setValue('');
          this.commentInputElement()?.nativeElement.focus();
        } else {
          const status = details.errorResponse.errorInfo.status;
          this.submissionError.set(
            status === 401
              ? 'Your session expired. Please sign in again to post your comment.'
              : status === 403
                ? 'YouTube did not allow this comment. Check your account permissions and whether comments are enabled.'
                : status === 0
                  ? 'Could not confirm whether your comment was posted. Check YouTube before trying again.'
                  : 'Could not post your comment. Please try again.',
          );
        }
      });
  }
}
