import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  FixedTopDirective,
  IVideoCategory,
  IVideoPlayerCardInfo,
  PlayerPosition,
  VideoCategoriesComponent,
  VideoPlayerCardComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'ay-videos-search',
  templateUrl: './videos-search.component.html',
  styleUrls: ['./videos-search.component.scss'],
  imports: [
    VideoCategoriesComponent,
    VideoPlayerCardComponent,
    InfiniteScrollDirective,
    FixedTopDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--max-width]': 'maxWidth()',
  },
})
export class VideosSearchComponent extends BaseWithSandBoxComponent {
  maxWidth = input('1280px');
  videoCategories = input.required<IVideoCategory[]>();
  videos = input.required<IVideoPlayerCardInfo[]>();
  PlayerPosition: typeof PlayerPosition = PlayerPosition;
  scrollDown = output<void>();
  displayedVideos = computed(() => {
    return this.videos().length > 0
      ? [...this.videos(), ...this.createSkeletonItems(4)]
      : this.createSkeletonItems(20);
  });
  private router = inject(Router);

  onSelect(videoId: string) {
    this.router.navigate(['watch'], {
      queryParams: {
        v: videoId,
      },
    });
  }

  onScrollDown() {
    this.scrollDown.emit();
  }

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
