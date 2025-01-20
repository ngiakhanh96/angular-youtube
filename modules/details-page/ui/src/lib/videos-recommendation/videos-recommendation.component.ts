import {
  IVideoCategory,
  VideoCategoriesComponent,
} from '@angular-youtube/home-page-ui';
import {
  IVideoPlayerCardInfo,
  PlayerPosition,
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
  selector: 'ay-videos-recommendation',
  templateUrl: './videos-recommendation.component.html',
  styleUrls: ['./videos-recommendation.component.scss'],
  imports: [VideoCategoriesComponent, VideoPlayerCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosRecommendationInfoComponent {
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
