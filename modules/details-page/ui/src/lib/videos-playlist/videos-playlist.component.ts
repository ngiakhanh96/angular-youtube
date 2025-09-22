import {
  IVideoPlayerCardInfo,
  PlayerPosition,
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

@Component({
  selector: 'ay-videos-playlist',
  templateUrl: './videos-playlist.component.html',
  styleUrls: ['./videos-playlist.component.scss'],
  imports: [VideoPlayerCardComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosPlaylistComponent {
  videosPlaylist = input.required<IVideoPlayerCardInfo[]>();
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
