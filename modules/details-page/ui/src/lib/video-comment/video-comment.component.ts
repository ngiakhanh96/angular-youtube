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
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, of, tap } from 'rxjs';

export interface IVideoCommentViewModelsWithContinuation {
  comments: IVideoCommentViewModel[];
  continuation?: string;
}
export interface IVideoCommentViewModel {
  comment: IVideoComment;
  videoId: string;
  repliesFn: (
    comment: IVideoComment,
    continuation?: string,
  ) => Observable<IVideoCommentViewModelsWithContinuation>;
}

@Component({
  selector: 'ay-video-comment',
  templateUrl: './video-comment.component.html',
  styleUrls: ['./video-comment.component.scss'],
  standalone: true,
  imports: [ImageDirective, TextIconButtonComponent, ChannelNameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCommentComponent implements OnDestroy {
  avatarWidthHeight = input<number>(40);
  commentViewModel = input.required<IVideoCommentViewModel>();
  comment = computed(() => this.commentViewModel().comment);
  sanitizer = inject(DomSanitizer);
  sanitizedCommentHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.comment().contentHtml),
  );
  dynamicComponentService = inject(DynamicComponentService);
  commentTextElement =
    viewChild.required<ElementRef<HTMLElement>>('commentText');
  linkComponentRefs: ComponentRef<unknown>[] = [];
  repliesCollapsed = signal(true);
  cachedNestedComments?: IVideoCommentViewModel[];
  cachedContinuation?: string;
  shouldUpdateCachedNestedComments = false;
  nestedCommentsResource = rxResource({
    params: () => ({ repliesCollapsed: this.repliesCollapsed() }),
    stream: (request) => {
      if (request.params.repliesCollapsed) {
        return of(<IVideoCommentViewModelsWithContinuation>{
          comments: [],
          continuation: '',
        });
      }

      const commentViewModel = this.commentViewModel();
      if (commentViewModel.comment.replies) {
        if (this.cachedNestedComments) {
          if (this.shouldUpdateCachedNestedComments) {
            this.shouldUpdateCachedNestedComments = false;
            return commentViewModel
              .repliesFn(commentViewModel.comment, this.cachedContinuation)
              .pipe(
                tap((nestedComments) => {
                  this.cachedNestedComments = [
                    ...(this.cachedNestedComments ?? []),
                    ...(nestedComments.comments ?? []),
                  ];
                  this.cachedContinuation = nestedComments?.continuation;
                }),
                map(
                  (nestedComments) =>
                    <IVideoCommentViewModelsWithContinuation>{
                      comments: nestedComments.comments ?? [],
                      continuation: nestedComments.continuation,
                    },
                ),
              );
          } else {
            return of(<IVideoCommentViewModelsWithContinuation>{
              comments: this.cachedNestedComments,
              continuation: this.cachedContinuation,
            });
          }
        } else {
          return commentViewModel.repliesFn(commentViewModel.comment).pipe(
            tap((nestedComments) => {
              this.cachedNestedComments = nestedComments?.comments;
              this.cachedContinuation = nestedComments?.continuation;
            }),
            map(
              (nestedComments) =>
                <IVideoCommentViewModelsWithContinuation>{
                  comments: nestedComments.comments ?? [],
                  continuation: nestedComments.continuation,
                },
            ),
          );
        }
      }
      this.cachedNestedComments = [];
      return of(<IVideoCommentViewModelsWithContinuation>{
        comments: [],
        continuation: '',
      });
    },
  });

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
      this.nestedCommentsResource.value()?.continuation !== '' &&
      this.nestedCommentsResource.value()?.continuation !== undefined
    );
  });

  constructor() {
    afterRenderEffect({
      write: () => {
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
            },
          );
          this.linkComponentRefs.push(linkComponentRef);
          aTag.replaceWith(linkComponentRef.location.nativeElement);
        }
      },
    });
  }

  onClickReplies() {
    this.repliesCollapsed.update((v) => !v);
  }

  onClickMoreReplies() {
    this.shouldUpdateCachedNestedComments = true;
    this.nestedCommentsResource.reload();
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }
}
