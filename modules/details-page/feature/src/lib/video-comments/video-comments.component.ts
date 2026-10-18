import {
  detailsPageEventGroup,
  DetailsPageStore,
} from '@angular-youtube/details-page-data-access';
import {
  CommentInputComponent,
  IVideoCommentViewModel,
  VideoCommentComponent,
} from '@angular-youtube/details-page-ui';
import {
  Auth,
  BaseWithSandBoxComponent,
  IInvidiousVideoCommentsInfo,
  IVideoComment,
} from '@angular-youtube/shared-data-access';

import {
  OverlayDirective,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField, readonly, required } from '@angular/forms/signals';
import { DomSanitizer } from '@angular/platform-browser';
import { defer, finalize, Observable, of } from 'rxjs';

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
    CommentInputComponent,
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
  commentViewModels = computed(() =>
    this.comments().map((comment) => this.createCommentViewModel(comment)),
  );
  totalCommentsString = computed(() => {
    const totalComments = this.commentsInfo()?.commentCount ?? 0;
    return `${Utilities.numberToStringWithCommas(totalComments)} Comment${totalComments > 1 ? 's' : ''}`;
  });
  isSubmitting = signal(false);
  private readonly isPostingReply = signal(false);
  private readonly postReplyFn = (parentId: string, text: string) =>
    defer(() => {
      if (this.isPostingReply()) {
        return of('Another reply is being posted. Please wait and try again.');
      }
      this.isPostingReply.set(true);
      const videoId = this.videoId();
      const event = detailsPageEventGroup.postYoutubeVideoReply({
        videoId,
        parentId,
        text,
      });
      return new Observable<string | undefined>((subscriber) => {
        this.dispatchEvent(
          event,
          () => {
            subscriber.next(undefined);
            subscriber.complete();
          },
          (error) => {
            subscriber.next(
              error.status === 401
                ? 'Your session expired. Please sign in again to reply.'
                : error.status === 403
                  ? 'YouTube did not allow this reply. Check your permissions and whether replies are enabled.'
                  : error.status === 0
                    ? 'Could not confirm whether your reply was posted. Check YouTube before trying again.'
                    : 'Could not post your reply. Please try again.',
            );
            subscriber.complete();
          },
        );
      }).pipe(finalize(() => this.isPostingReply.set(false)));
    });
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
    required(path.commentInput);
    readonly(path.commentInput, { when: () => this.isSubmitting() });
  });
  submissionError = signal('');
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
      this.submissionError.set('');
    });
  }

  private createCommentViewModel(
    comment: IVideoComment,
    parentId = comment.commentId,
  ): IVideoCommentViewModel {
    return {
      comment,
      videoId: this.videoId(),
      replies: computed(() => {
        const nestedCommentsInfo =
          this.detailsPageStore.nestedVideoCommentsInfo()[comment.commentId];
        return {
          comments: (nestedCommentsInfo?.comments ?? []).map((reply) =>
            this.createCommentViewModel(reply, parentId),
          ),
          continuation: nestedCommentsInfo?.continuation,
        };
      }),
      loadRepliesFn: (continuation) => this.loadReplies(comment, continuation),
      // Replies to replies still belong to the top-level YouTube comment.
      postReplyFn: (_parentId, text) => this.postReplyFn(parentId, text),
    };
  }

  private loadReplies(comment: IVideoComment, continuation?: string) {
    if (
      !continuation &&
      this.detailsPageStore.nestedVideoCommentsInfo()[comment.commentId]
    ) {
      return;
    }
    this.dispatchEvent(
      detailsPageEventGroup.loadYoutubeVideoComments({
        videoId: this.videoId(),
        continuation: continuation ?? comment.replies?.continuation,
        nextPage: !!continuation,
        sortBy: this.detailsPageStore.commentSortBy(),
        commentId: comment.commentId,
      }),
    );
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
    this.form.commentInput().reset('');
    this.submissionError.set('');
  }

  submitComment(text: string) {
    const videoId = this.videoId();
    const channelId = this.channelId();
    if (
      !this.form().valid() ||
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
    this.dispatchEvent(
      event,
      () => {
        this.isSubmitting.set(false);
        this.form.commentInput().reset('');
        this.form.commentInput().focusBoundControl();
      },
      (error) => {
        this.isSubmitting.set(false);
        this.submissionError.set(
          error.status === 401
            ? 'Your session expired. Please sign in again to post your comment.'
            : error.status === 403
              ? 'YouTube did not allow this comment. Check your account permissions and whether comments are enabled.'
              : error.status === 0
                ? 'Could not confirm whether your comment was posted. Check YouTube before trying again.'
                : 'Could not post your comment. Please try again.',
        );
      },
    );
  }
}
