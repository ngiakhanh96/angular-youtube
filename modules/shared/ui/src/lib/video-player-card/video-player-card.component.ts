import { Auth } from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ImageDirective } from '../directives/image/image.directive';
import { SkeletonDirective } from '../directives/skeleton/skeleton.directive';
import { DropdownButtonComponent } from '../dropdown-button/dropdown-button.component';
import { ISection } from '../menu/menu.component';
import { NativeYouTubePlayerComponent } from '../native-youtube-player/native-youtube-player.component';
import { OverviewVideoInfoComponent } from '../overview-video-info/overview-video-info.component';
import { Utilities } from '../utilities/utilities';

export interface IVideoPlayerCardInfo {
  isSkeleton: boolean;
  videoId: string;
  videoUrl: string;
  title: string;
  channelName: string;
  viewCount?: number;
  publishedDate?: Date;
  duration?: string;
  lengthSeconds?: number;
  channelLogoUrl?: string;
  isVerified: boolean;
  hideThumbnailSettingsButton?: boolean;
}

export enum PlayerPosition {
  Vertical = 'column',
  Horizontal = 'row',
}

@Component({
  selector: 'ay-video-player-card',
  imports: [
    ImageDirective,
    DropdownButtonComponent,
    NativeYouTubePlayerComponent,
    OverviewVideoInfoComponent,
    SkeletonDirective,
  ],
  templateUrl: './video-player-card.component.html',
  styleUrls: ['./video-player-card.component.scss'],
  host: {
    '[style.--thumbnail-settings-button-margin-top]':
      'thumbnailSettingsButtonMarginTop()',
    '[style.--thumbnail-duration-right-bottom]':
      'thumbnailDurationRightBottom()',
    '[style.--horizontal-max-width]': 'horizontalMaxWidth()',
    '[style.--horizontal-min-width]': 'horizontalMinWidth()',
    '[style.--horizontal-thumbnail-margin-right]':
      'horizontalThumbnailPlayerContainerMarginRight()',
    '(click)': 'onClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerCardComponent {
  videoPlayerCardInfo = input<IVideoPlayerCardInfo>({
    isSkeleton: false,
    videoId: '',
    videoUrl: '',
    title: '',
    channelName: '',
    viewCount: 0,
    publishedDate: new Date(),
    isVerified: false,
  });
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
  titleLineHeight = input('22px');
  channelNameFontSize = input('14px');
  channelMarginTop = input('0px');
  channelInfoHeight = input('24px');
  videoStatisticFontSize = input('14px');
  titleMarginBottom = input('4px');
  playerBorderRadius = input('12px');
  boxShadow = input('inset 0 120px 90px -90px rgba(0, 0, 0, 0.8)');
  thumbnailSettingsButtonMarginTop = input('6px');
  thumbnailDurationRightBottom = input('8px');
  showChannelNameFirst = input(false);
  onPlayOnHover = input(true);
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
  settingItems = computed<ISection[]>(() =>
    this.authService.accessToken()
      ? [
          {
            sectionItems: [
              {
                iconName: 'add-to-queue',
                displayHtml: 'Add to queue',
              },
              {
                iconName: 'watch-later',
                displayHtml: 'Save to Watch later',
              },
              {
                iconName: 'save-to-playlist',
                displayHtml: 'Save to playlist',
              },
              {
                iconName: 'downloads',
                displayHtml: 'Download',
              },
              {
                iconName: 'share',
                displayHtml: 'Share',
              },
            ],
          },
          {
            sectionItems: [
              {
                iconName: 'not-interested',
                displayHtml: 'Not interested',
              },
              {
                iconName: 'dont-recommend-channel',
                displayHtml: "Don't recommend channel",
              },
              {
                iconName: 'report',
                displayHtml: 'Report',
              },
            ],
          },
        ]
      : [
          {
            sectionItems: [
              {
                iconName: 'add-to-queue',
                displayHtml: 'Add to queue',
              },
              {
                iconName: 'downloads',
                displayHtml: 'Download',
              },
              {
                iconName: 'share',
                displayHtml: 'Share',
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
    this.viewCount() != null
      ? Utilities.numberToString(this.viewCount()!, 'view', 'No')
      : undefined,
  );
  publishedDate = computed(() => this.videoPlayerCardInfo()?.publishedDate);
  publishedDateString = computed(() =>
    this.publishedDate() != null
      ? Utilities.publishedDateToString(this.publishedDate()!)
      : undefined,
  );
  duration = computed(() => this.videoPlayerCardInfo()?.duration);
  lengthSeconds = computed(() => this.videoPlayerCardInfo()?.lengthSeconds);
  durationString = computed(() => {
    const duration = this.duration();
    const lengthSeconds = this.lengthSeconds();
    if (duration == null && lengthSeconds == null) {
      return undefined;
    }
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

  onClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLButtonElement)) {
      this.selected.emit(this.videoId());
    }
  }

  onMouseEnter() {
    if (this.onPlayOnHover()) {
      this.player()?.playVideo();
      this.thumbnailDurationDisplay.set('none');
    }
  }

  onMouseLeave() {
    if (this.onPlayOnHover()) {
      this.player()?.pauseVideo();
      this.thumbnailDurationDisplay.set('flex');
    }
  }
}
