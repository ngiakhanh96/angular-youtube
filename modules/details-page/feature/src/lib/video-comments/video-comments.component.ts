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
  OverlayDirective,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { form, FormField, readonly } from '@angular/forms/signals';
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
    CdkOverlayOrigin,
    OverlayDirective,
    FormField,
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
        sortBy: this.detailsPageStore.commentSortBy(),
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
  isSubmitting = signal(false);
  private readonly commentModel = linkedSignal<
    CommentSortOption,
    { commentInput: string; selectedSort: CommentSortOption }
  >({
    source: () =>
      this.detailsPageStore.commentSortBy() === 'new'
        ? CommentSortOption.NewestFirst
        : CommentSortOption.TopComments,
    computation: (selectedSort, previous) => ({
      commentInput: previous?.value.commentInput ?? '',
      selectedSort,
    }),
  });
  readonly form = form(this.commentModel, (path) => {
    readonly(path.commentInput, { when: () => this.isSubmitting() });
  });
  submissionError = signal('');
  commentInputElement = viewChild<ElementRef<HTMLInputElement>>(
    'commentInputElement',
  );
  isCommentFocused = signal(false);
  isSortOpen = signal(false);
  readonly sortOptions = [
    {
      value: CommentSortOption.TopComments,
      label: 'Top',
      description: 'Show featured comments',
    },
    {
      value: CommentSortOption.NewestFirst,
      label: 'Newest',
      description: 'Show recent comments, including potential spam',
    },
  ];
  sanitizer = inject(DomSanitizer);
  auth = inject(Auth);

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
      untracked(() => this.form.commentInput().reset(''));
      this.isCommentFocused.set(false);
      this.submissionError.set('');
    });
  }

  selectSort(sort: CommentSortOption) {
    this.isSortOpen.set(false);
    const videoId = this.videoId();
    const sortBy = sort === CommentSortOption.NewestFirst ? 'new' : 'top';
    if (sortBy === this.detailsPageStore.commentSortBy()) return;

    this.dispatchEvent(
      detailsPageEventGroup.loadYoutubeVideoComments({
        videoId,
        sortBy,
      }),
    );
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
    this.form.commentInput().reset('');
    this.submissionError.set('');
  }

  submitComment() {
    const text = this.form.commentInput().value().trim();
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
          this.form.commentInput().reset('');
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
