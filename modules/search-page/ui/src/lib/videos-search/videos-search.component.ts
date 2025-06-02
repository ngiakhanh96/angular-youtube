import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  FixedTopDirective,
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
  inject,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

//TODO implement local spinner instead of global spinner
@Component({
  selector: 'ay-videos-search',
  templateUrl: './videos-search.component.html',
  styleUrls: ['./videos-search.component.scss'],
  imports: [
    VideoCategoriesComponent,
    VideoPlayerCardComponent,
    InfiniteScrollDirective,
    FixedTopDirective,
    NgTemplateOutlet,
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
  Utilities = Utilities;
  displayedVideos = computed(() => {
    return this.videos().length > 0
      ? [...this.videos(), ...Utilities.createPlayerSkeletonItems(4)]
      : Utilities.createPlayerSkeletonItems(20);
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
}
