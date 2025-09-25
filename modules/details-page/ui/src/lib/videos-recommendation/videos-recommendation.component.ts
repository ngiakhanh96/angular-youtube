import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  PlayerPosition,
  Utilities,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'ay-videos-recommendation',
  templateUrl: './videos-recommendation.component.html',
  styleUrls: ['./videos-recommendation.component.scss'],
  imports: [
    VideoCategoriesComponent,
    VideoPlayerCardComponent,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosRecommendationInfoComponent {
  videoCategories = input.required<IVideoCategory[]>();
  videos = input.required<IVideoPlayerCardInfo[]>();
  PlayerPosition: typeof PlayerPosition = PlayerPosition;
  Utilities = Utilities;
  selectVideo = output<string>();

  onSelect(videoId: string) {
    this.selectVideo.emit(videoId);
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
