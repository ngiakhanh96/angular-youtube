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
  duration?: string;
  lengthSeconds?: number;
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
  host: {
    '[style.--thumbnail-settings-button-margin-top]':
      'thumbnailSettingsButtonMarginTop()',
    '[style.--thumbnail-duration-right]': 'thumbnailDurationRight()',
    '[style.--horizontal-max-width]': 'horizontalMaxWidth()',
    '[style.--horizontal-min-width]': 'horizontalMinWidth()',
    '[style.--horizontal-thumbnail-margin-right]':
      'horizontalThumbnailPlayerContainerMarginRight()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerCardComponent {
  videoPlayerCardInfo = input.required<IVideoPlayerCardInfo>();
  playerPosition = input(PlayerPosition.Vertical);
  isVerticalPlayerPosition = computed(
    () => this.playerPosition() === PlayerPosition.Vertical,
  );
  horizontalMaxWidth = input('168px');
  horizontalMinWidth = input('168px');
  horizontalThumbnailPlayerContainerMarginRight = input('8px');
  thumbnailMetaClass = computed(() => {
    return this.isVerticalPlayerPosition()
      ? 'thumbnail__meta--vertical'
      : 'thumbnail__meta--horizontal';
  });
  titleFontWeight = input('500');
  titleFontSize = input('16px');
  channelNameFontSize = input('14px');
  channelMarginTop = input('0px');
  videoStatisticFontSize = input('14px');
  titleMarginBottom = input('4px');
  playerBorderRadius = input('12px');
  boxShadow = input('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  thumbnailSettingsButtonMarginTop = input('6px');
  thumbnailDurationRight = input('8px');
  thumbnailContainerFlexDirection = computed(() =>
    this.playerPosition().toString(),
  );
  thumbnailPlayerContainerClass = computed(() => {
    return this.playerPosition() === PlayerPosition.Vertical
      ? 'thumbnail__player-container--vertical'
      : 'thumbnail__player-container--horizontal';
  });
  thumbnailContainerClass = computed(() => {
    return this.isVerticalPlayerPosition()
      ? 'thumbnail__container--vertical'
      : 'thumbnail__container--horizontal';
  });
  thumbnailVideoInfoClass = computed(() => {
    return this.isVerticalPlayerPosition()
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
  lengthSeconds = computed(() => this.videoPlayerCardInfo()?.lengthSeconds);
  durationString = computed(() => {
    const duration = this.duration();
    const lengthSeconds = this.lengthSeconds();
    return duration
      ? Utilities.iso8601DurationToString(duration)
      : Utilities.iso8601DurationToString(
          Utilities.secondsToIso8601Duration(lengthSeconds ?? 0),
        );
  });
  channelLogoUrl = computed(() => this.videoPlayerCardInfo()?.channelLogoUrl);
  isVerified = computed(() => this.videoPlayerCardInfo()?.isVerified);
  thumbnailDurationDisplay = signal('flex');
  selected = output<string>();

  private player = viewChild(NativeYouTubePlayerComponent);
  private authService = inject(Auth);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLButtonElement)) {
      this.selected.emit(this.videoId());
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
