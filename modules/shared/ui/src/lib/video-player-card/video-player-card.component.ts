import { Auth } from '@angular-youtube/shared-data-access';
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
import { DropdownButtonComponent } from '../dropdown-button/dropdown-button.component';
import { NativeYouTubePlayerComponent } from '../native-youtube-player/native-youtube-player.component';
import { OverviewVideoInfoComponent } from '../overview-video-info/overview-video-info.component';
import { Utilities } from '../utilities/utilities';

export interface IVideoPlayerCardInfo {
  videoId: string;
  videoUrl: string;
  title: string;
  channelName: string;
  viewCount: number;
  publishedDate: Date;
  duration: string;
  channelLogoUrl?: string;
  isVerified: boolean;
}

export enum PlayerPosition {
  Vertical = 'column',
  Horizontal = 'row',
}

@Component({
  selector: 'ay-video-player-card',
  imports: [
    NgOptimizedImage,
    DropdownButtonComponent,
    NativeYouTubePlayerComponent,
    OverviewVideoInfoComponent,
  ],
  templateUrl: './video-player-card.component.html',
  styleUrls: ['./video-player-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerCardComponent {
  videoPlayerCardInfo = input.required<IVideoPlayerCardInfo>();
  playerPosition = input(PlayerPosition.Vertical);
  titleFontSize = input('16px');
  titleMarginBottom = input('4px');
  playerBorderRadius = input('12px');
  boxShadow = input('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  thumbnailContainerFlexDirection = computed(() =>
    this.playerPosition().toString(),
  );
  thumbnailPlayerContainerClass = computed(() => {
    return this.playerPosition() === PlayerPosition.Vertical
      ? 'thumbnail__player-container--vertical'
      : 'thumbnail__player-container--horizontal';
  });
  thumbnailContainerClass = computed(() => {
    return this.playerPosition() === PlayerPosition.Vertical
      ? 'thumbnail__container--vertical'
      : 'thumbnail__container--horizontal';
  });
  thumbnailVideoInfoClass = computed(() => {
    return this.playerPosition() === PlayerPosition.Vertical
      ? 'thumbnail__video-info--vertical'
      : 'thumbnail__video-info--horizontal';
  });
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
  videoId = computed(() => this.videoPlayerCardInfo()?.videoId);
  videoUrl = computed(() => this.videoPlayerCardInfo()?.videoUrl);
  title = computed(() => this.videoPlayerCardInfo()?.title);
  channelName = computed(() => this.videoPlayerCardInfo()?.channelName);
  viewCount = computed(() => this.videoPlayerCardInfo()?.viewCount);
  viewCountString = computed(() =>
    Utilities.numberToString(this.viewCount(), 'view', 'No'),
  );
  publishedDate = computed(() => this.videoPlayerCardInfo()?.publishedDate);
  publishedDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
  duration = computed(() => this.videoPlayerCardInfo()?.duration);
  durationString = computed(() => Utilities.durationToString(this.duration()));
  channelLogoUrl = computed(() => this.videoPlayerCardInfo()?.channelLogoUrl);
  isVerified = computed(() => this.videoPlayerCardInfo()?.isVerified);
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
}
