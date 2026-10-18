import { IVideoComment } from '@angular-youtube/shared-data-access';
import {
  ChannelNameComponent,
  DynamicComponentService,
  ImageDirective,
  LinkComponent,
  TextIconButtonComponent,
  Utilities,
} from '@angular-youtube/shared-ui';
import {
  afterNextRender,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, readonly, required } from '@angular/forms/signals';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, Observable } from 'rxjs';
import { CommentInputComponent } from '../comment-input/comment-input.component';

export interface IVideoCommentViewModelsWithContinuation {
  comments: IVideoCommentViewModel[];
  continuation?: string;
}
export interface IVideoCommentViewModel {
  comment: IVideoComment;
  videoId: string;
  replies: Signal<IVideoCommentViewModelsWithContinuation>;
  loadRepliesFn: (continuation?: string) => void;
  postReplyFn: (
    parentId: string,
    text: string,
  ) => Observable<string | undefined>;
}

@Component({
  selector: 'ay-video-comment',
  templateUrl: './video-comment.component.html',
  styleUrls: ['./video-comment.component.scss'],
  imports: [
    ImageDirective,
    TextIconButtonComponent,
    ChannelNameComponent,
    CommentInputComponent,
    FormField,
  ],
})
export class VideoCommentComponent implements OnDestroy {
  readonly isUserLoggedIn = input(false);
  avatarWidthHeight = input<number>(40);
  commentViewModel = input.required<IVideoCommentViewModel>();
  comment = computed(() => this.commentViewModel().comment);
  authorThumbnailUrl = computed(
    () => this.comment().authorThumbnail ?? Utilities.defaultUserAvatarUrl,
  );
  sanitizer = inject(DomSanitizer);
  sanitizedCommentHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.comment().contentHtml),
  );
  dynamicComponentService = inject(DynamicComponentService);
  commentTextElement =
    viewChild.required<ElementRef<HTMLElement>>('commentText');
  linkComponentRefs: ComponentRef<unknown>[] = [];
  repliesCollapsed = signal(true);
  private readonly destroyRef = inject(DestroyRef);
  readonly isReplyOpen = signal(false);
  readonly isSubmittingReply = signal(false);
  private readonly replyModel = signal({ text: '' });
  readonly replyForm = form(this.replyModel, (path) => {
    required(path.text);
    readonly(path.text, { when: () => this.isSubmittingReply() });
  });
  readonly replyError = signal('');
  readonly replyButton = viewChild<TextIconButtonComponent>('replyButton');
  readonly replyInputId = computed(
    () => `reply-input-${this.comment().commentId}`,
  );
  readonly replies = computed(() => this.commentViewModel().replies());

  repliesCount = computed(() => {
    const repliesCount =
      this.commentViewModel().comment.replies?.replyCount ?? 0;
    return repliesCount;
  });

  repliesCountString = computed(() => {
    const repliesCount = this.repliesCount();
    return (
      Utilities.numberToString(repliesCount) +
      ' ' +
      (repliesCount > 1 ? 'replies' : 'reply')
    );
  });

  likeCountString = computed(() => {
    const likeCount = this.comment().likeCount;
    return Utilities.numberToString(likeCount ?? 0);
  });

  hasMoreReplies = computed(() => {
    return (
      this.replies().continuation !== '' &&
      this.replies().continuation !== undefined
    );
  });

  constructor() {
    afterNextRender({
      read: () => {
        const commentTextElement = this.commentTextElement().nativeElement;
        const aTags = Array.from(commentTextElement.getElementsByTagName('a'));
        for (const aTag of aTags) {
          const linkComponentRef = this.dynamicComponentService.createComponent(
            LinkComponent,
            {
              href: aTag.href,
              attributeHref: aTag.getAttribute('href') ?? '',
              text: aTag.textContent,
              currentVideoId: this.commentViewModel().videoId,
              forComment: true,
            },
          );
          this.linkComponentRefs.push(linkComponentRef);
          aTag.replaceWith(linkComponentRef.location.nativeElement);
        }
      },
    });
  }

  onClickReplies() {
    if (this.repliesCollapsed()) {
      this.commentViewModel().loadRepliesFn();
    }
    this.repliesCollapsed.update((v) => !v);
  }

  onClickMoreReplies() {
    const continuation = this.replies().continuation;
    if (continuation) {
      this.commentViewModel().loadRepliesFn(continuation);
    }
  }

  openReply() {
    this.isReplyOpen.set(true);
  }

  cancelReply() {
    if (this.isSubmittingReply()) return;
    this.replyForm.text().reset('');
    this.isReplyOpen.set(false);
    this.replyError.set('');
    this.replyButton()?.focus();
  }

  submitReply(text: string) {
    const postReply = this.commentViewModel().postReplyFn;
    if (
      !this.replyForm().valid() ||
      !text ||
      !postReply ||
      this.isSubmittingReply()
    )
      return;
    this.isSubmittingReply.set(true);
    this.replyError.set('');
    postReply(this.comment().commentId, text)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmittingReply.set(false)),
      )
      .subscribe({
        next: (error) => {
          if (error) {
            this.replyError.set(error);
            return;
          }
          this.isReplyOpen.set(false);
          this.replyForm.text().reset('');
          this.repliesCollapsed.set(false);
          this.replyButton()?.focus();
        },
        error: () =>
          this.replyError.set('Could not post your reply. Please try again.'),
      });
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }
}
