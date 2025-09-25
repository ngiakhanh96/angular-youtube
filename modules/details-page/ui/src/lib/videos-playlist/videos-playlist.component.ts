import {
  DropdownButtonComponent,
  IVideoPlayerCardInfo,
  PlayerPosition,
  TextIconButtonComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
  viewChildren,
} from '@angular/core';

export interface IVideoPlaylistInfo {
  title: string;
  channelName: string;
  totalVideoCount: number;
}

@Component({
  selector: 'ay-videos-playlist',
  templateUrl: './videos-playlist.component.html',
  styleUrls: ['./videos-playlist.component.scss'],
  imports: [
    VideoPlayerCardComponent,
    NgTemplateOutlet,
    TextIconButtonComponent,
    DropdownButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosPlaylistComponent {
  playlistItemsInfo = input.required<IVideoPlayerCardInfo[]>();
  playlistInfo = input.required<IVideoPlaylistInfo>();
  selectedVideoId = model.required<string>();
  currentVideoPosition = input(1);
  PlayerPosition: typeof PlayerPosition = PlayerPosition;

  playlistContainer =
    viewChild.required<ElementRef<HTMLElement>>('playlistContainer');
  playlistItems = viewChildren<ElementRef<HTMLElement>>('playlistItem');

  constructor() {
    afterRenderEffect({
      read: () => {
        this.selectedVideoId();
        this.scrollToSelectedVideo();
      },
    });
  }

  private scrollToSelectedVideo() {
    const items = this.playlistItems();
    // Find the item with class 'selected'
    const selectedItem = items.find((item) =>
      item.nativeElement.classList.contains('selected'),
    );

    if (selectedItem && this.playlistContainer()) {
      const selectedElement = selectedItem.nativeElement;
      const container = this.playlistContainer().nativeElement;

      // Calculate if element is in view
      const containerRect = container.getBoundingClientRect();
      const elementRect = selectedElement.getBoundingClientRect();

      if (
        elementRect.bottom > containerRect.bottom ||
        elementRect.top < containerRect.top
      ) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }
}
