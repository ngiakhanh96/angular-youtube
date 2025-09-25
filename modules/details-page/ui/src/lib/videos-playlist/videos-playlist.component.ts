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
  input,
  model,
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
}
