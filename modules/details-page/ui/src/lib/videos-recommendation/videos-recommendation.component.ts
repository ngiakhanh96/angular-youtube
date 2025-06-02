import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  PlayerPosition,
  Utilities,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  Utilities = Utilities;
  private router = inject(Router);

  onSelect(videoId: string) {
    this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }

  displayedVideos = computed(() => {
    return this.videos().length > 0
      ? [...this.videos()]
      : this.createSkeletonItems(20);
  });

  createSkeletonItems(count: number): IVideoPlayerCardInfo[] {
    const initialSkeletonItems: IVideoPlayerCardInfo[] = [];
    for (let i = 0; i < count; i++) {
      initialSkeletonItems.push({
        isSkeleton: true,
        videoId: `skeleton-${i}`,
        title: '',
        channelName: '',
        viewCount: 0,
        publishedDate: new Date(),
        duration: '',
        lengthSeconds: 0,
        channelLogoUrl: '',
        videoUrl: '',
        isVerified: false,
      });
    }
    return initialSkeletonItems;
  }
}
