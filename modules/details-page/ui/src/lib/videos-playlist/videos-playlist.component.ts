import {
  DropdownButtonComponent,
  IVideoPlayerCardInfo,
  PlayerPosition,
  TextIconButtonComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';

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
  PlayerPosition: typeof PlayerPosition = PlayerPosition;
  private router = inject(Router);

  async onSelect(videoId: string) {
    await this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }
}
