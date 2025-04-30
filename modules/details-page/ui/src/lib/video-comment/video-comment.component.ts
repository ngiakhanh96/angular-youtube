import { IVideoComment } from '@angular-youtube/shared-data-access';
import {
  DynamicComponentService,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { VideoCommentContentComponent } from '../video-comment-content/video-comment-content.component';

@Component({
  selector: 'ay-video-comment',
  templateUrl: './video-comment.component.html',
  styleUrls: ['./video-comment.component.scss'],
  standalone: true,
  imports: [VideoCommentContentComponent, TextIconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCommentComponent {
  comment = input.required<IVideoComment>();
  videoId = input.required<string>();
  dynamicComponentService = inject(DynamicComponentService);
  commentTextElement =
    viewChild.required<ElementRef<HTMLElement>>('commentText');
  repliesCollapsed = model(true);

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = this.getRepliesCount(comment);
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }

  onClickReplies() {
    this.repliesCollapsed.update((v) => !v);
  }
}
