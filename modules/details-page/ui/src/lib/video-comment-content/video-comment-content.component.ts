import { IVideoComment } from '@angular-youtube/shared-data-access';
import {
  ChannelNameComponent,
  DynamicComponentService,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
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
import { Observable, of, tap } from 'rxjs';

export interface IVideoCommentViewModel {
  comment: IVideoComment;
  videoId: string;
  repliesFn?: (
    comment: IVideoComment,
    cachedNestedComments?: IVideoCommentViewModel[],
  ) => Observable<IVideoCommentViewModel[]>;
}

@Component({
  selector: 'ay-video-comment-content',
  templateUrl: './video-comment-content.component.html',
  styleUrls: ['./video-comment-content.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, TextIconButtonComponent, ChannelNameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCommentContentComponent implements OnDestroy {
  commentViewModel = input.required<IVideoCommentViewModel>();
  comment = computed(() => this.commentViewModel().comment);
  sanitizer = inject(DomSanitizer);
  dynamicComponentService = inject(DynamicComponentService);
  commentTextElement =
    viewChild.required<ElementRef<HTMLElement>>('commentText');
  linkComponentRefs: ComponentRef<unknown>[] = [];
  repliesCollapsed = signal(true);
  cachedNestedComments?: IVideoCommentViewModel[];
  nestedCommentsResource = rxResource({
    request: this.repliesCollapsed,
    loader: ({ request: repliesCollapsed }) => {
      if (repliesCollapsed) {
        return of([]);
      }

      const commentViewModel = this.commentViewModel();
      if (commentViewModel.repliesFn) {
        return commentViewModel
          .repliesFn(commentViewModel.comment, this.cachedNestedComments)
          .pipe(
            tap(
              (nestedComments) => (this.cachedNestedComments = nestedComments),
            ),
          );
      }
      this.cachedNestedComments = [];
      return of([]);
    },
  });

  constructor() {
    afterRenderEffect({
      write: async () => {
        const commentTextElement = this.commentTextElement().nativeElement;
        const aTags = Array.from(commentTextElement.getElementsByTagName('a'));
        for (const aTag of aTags) {
          const linkComponentRef =
            await this.dynamicComponentService.createComponentLazily(
              () => import('@angular-youtube/shared-ui'),
              'LinkComponent',
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

  repliesCount = computed(() => {
    const repliesCount =
      this.commentViewModel().comment.replies?.replyCount ?? 0;
    return repliesCount;
  });

  repliesCountString = computed(() => {
    const repliesCount = this.repliesCount();
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  });

  onClickReplies() {
    this.repliesCollapsed.update((v) => !v);
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }
}
