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
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ay-video-comment',
  templateUrl: './video-comment.component.html',
  styleUrls: ['./video-comment.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, TextIconButtonComponent, ChannelNameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCommentComponent implements OnDestroy {
  comment = input.required<IVideoComment>();
  sanitizer = inject(DomSanitizer);
  dynamicComponentService = inject(DynamicComponentService);
  commentTextElement =
    viewChild.required<ElementRef<HTMLElement>>('commentText');
  linkComponentRefs: ComponentRef<unknown>[] = [];

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
              },
            );
          this.linkComponentRefs.push(linkComponentRef);
          aTag.replaceWith(linkComponentRef.location.nativeElement);
        }
      },
    });
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = this.getRepliesCount(comment);
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }
}
