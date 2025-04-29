import {
  Auth,
  IInvidiousVideoCommentsInfo,
  IVideoComment,
} from '@angular-youtube/shared-data-access';
import {
  ChannelNameComponent,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
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
    ChannelNameComponent,
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

  onCommentFocus() {
    this.isCommentFocused.set(true);
  }

  onCommentCancel() {
    this.isCommentFocused.set(false);
    this.commentInput.reset();
  }

  onCommentSubmit() {
    if (this.commentInput.value) {
      // TODO: Implement comment submission
      console.log('Submitting comment:', this.commentInput.value);
      this.onCommentCancel();
    }
  }

  toggleSortDropdown() {
    this.isSortOpen.update((v) => !v);
  }

  selectSort(sort: CommentSortOption) {
    this.selectedSort.set(sort);
    this.isSortOpen.set(false);
    this.sortChanged.emit(sort);
  }

  getRepliesCount(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount;
  }

  getRepliesCountString(comment: IVideoComment) {
    const repliesCount = comment.replies?.replyCount ?? 0;
    return repliesCount + ' ' + (repliesCount > 1 ? 'replies' : 'reply');
  }
}
