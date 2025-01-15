import { Auth } from '@angular-youtube/shared-data-access';
import {
  DropdownButtonComponent,
  NativeYouTubePlayerComponent,
  Utilities,
  VideoMainInfoComponent,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ay-video-player-card',
  imports: [
    NgOptimizedImage,
    DropdownButtonComponent,
    NativeYouTubePlayerComponent,
    VideoMainInfoComponent,
  ],
  templateUrl: './video-player-card.component.html',
  styleUrls: ['./video-player-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerCardComponent {
  settingItems = computed(() =>
    this.authService.accessToken()
      ? [
          {
            sectionItems: [
              {
                iconName: 'add-to-queue',
                displayText: 'Add to queue',
              },
              {
                iconName: 'watch-later',
                displayText: 'Save to Watch later',
              },
              {
                iconName: 'save-to-playlist',
                displayText: 'Save to playlist',
              },
              {
                iconName: 'downloads',
                displayText: 'Download',
              },
              {
                iconName: 'share',
                displayText: 'Share',
              },
            ],
          },
          {
            sectionItems: [
              {
                iconName: 'not-interested',
                displayText: 'Not interested',
              },
              {
                iconName: 'dont-recommend-channel',
                displayText: "Don't recommend channel",
              },
              {
                iconName: 'report',
                displayText: 'Report',
              },
            ],
          },
        ]
      : [
          {
            sectionItems: [
              {
                iconName: 'add-to-queue',
                displayText: 'Add to queue',
              },
              {
                iconName: 'downloads',
                displayText: 'Download',
              },
              {
                iconName: 'share',
                displayText: 'Share',
              },
            ],
          },
        ],
  );
  videoId = input.required<string>();
  videoUrl = input.required<string>();
  title = input.required<string>();
  channelName = input.required<string>();
  viewCount = input.required<number>();
  viewCountString = computed(() =>
    VideoPlayerCardComponent.computeViewCountString(this.viewCount()),
  );
  publishedDate = input.required<Date>();
  publishDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
  duration = input.required<string>();
  durationString = computed(() => Utilities.durationToString(this.duration()));
  channelLogoUrl = input.required<string>();

  thumbnailDurationDisplay = signal('flex');
  select = output<string>();

  private player = viewChild(NativeYouTubePlayerComponent);
  private authService = inject(Auth);
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLButtonElement)) {
      this.select.emit(this.videoId());
    }
  }

  onMouseEnter() {
    this.player()?.playVideo();
    this.thumbnailDurationDisplay.set('none');
  }

  onMouseLeave() {
    this.player()?.pauseVideo();
    this.thumbnailDurationDisplay.set('flex');
  }

  static computeViewCountString(viewCount: number) {
    return Utilities.numberToString(viewCount, 'view', 'No');
  }
}
