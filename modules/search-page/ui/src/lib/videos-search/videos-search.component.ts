import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  FixedDirective,
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
    FixedDirective,
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
