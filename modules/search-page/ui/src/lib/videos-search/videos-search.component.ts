import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  PlayerPosition,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ay-videos-search',
  templateUrl: './videos-search.component.html',
  styleUrls: ['./videos-search.component.scss'],
  imports: [VideoCategoriesComponent, VideoPlayerCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosSearchComponent extends BaseWithSandBoxComponent {
  videoCategories = input.required<IVideoCategory[]>();
  videos = input.required<IVideoPlayerCardInfo[]>();
  PlayerPosition: typeof PlayerPosition = PlayerPosition;
  private router = inject(Router);

  onSelect(videoId: string) {
    this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }
}
