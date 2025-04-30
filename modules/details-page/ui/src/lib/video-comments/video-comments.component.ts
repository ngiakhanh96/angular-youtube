import {
  Auth,
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
import { VideoCommentComponent } from '../video-comment/video-comment.component';

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
export class VideoCommentsComponent {
  commentsInfo = input.required<IInvidiousVideoCommentsInfo | undefined>();
  comments = computed(() => this.commentsInfo()?.comments ?? []);
  totalComments = computed(() => this.commentsInfo()?.commentCount ?? 0);
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
