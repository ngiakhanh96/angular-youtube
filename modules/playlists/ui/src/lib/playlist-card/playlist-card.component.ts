import { IPlaylistItem } from '@angular-youtube/shared-data-access';
import {
  IconDirective,
  SkeletonDirective,
  TextRenderComponent,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ay-playlist-card',
  imports: [
    NgOptimizedImage,
    MatIconModule,
    IconDirective,
    SkeletonDirective,
    TextRenderComponent,
  ],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  readonly playlist = input.required<IPlaylistItem>();
  readonly isSkeleton = input(false);
  readonly disabled = input(false);
  readonly openPlaylist = output<string>();
  private readonly thumbnails = computed(() => {
    const thumbnails = this.playlist().snippet.thumbnails;
    return [
      thumbnails?.high?.url,
      thumbnails?.medium?.url,
      thumbnails?.default?.url,
    ].filter((url): url is string => !!url);
  });
  private readonly thumbnailIndex = linkedSignal(() => {
    this.thumbnails();
    return 0;
  });
  protected readonly thumbnailUrl = computed(
    () => this.thumbnails()[this.thumbnailIndex()],
  );
  protected readonly privacyLabel = computed(() => {
    switch (this.playlist().status.privacyStatus) {
      case 'private':
        return 'Private Playlist';
      case 'unlisted':
        return 'Unlisted Playlist';
      default:
        return 'Public Playlist';
    }
  });

  protected onThumbnailError(): void {
    this.thumbnailIndex.update((index) => index + 1);
  }
}
