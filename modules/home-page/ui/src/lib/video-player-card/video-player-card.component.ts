import { Auth } from '@angular-youtube/shared-data-access';
import {
  NativeYouTubePlayerComponent,
  SettingsButtonComponent,
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
    SettingsButtonComponent,
    NativeYouTubePlayerComponent,
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
    VideoPlayerCardComponent.computePublishDateString(this.publishedDate()),
  );
  duration = input.required<string>();
  durationString = computed(() =>
    VideoPlayerCardComponent.computeDurationString(this.duration()),
  );
  channelLogoUrl = input.required<string>();

  thumbnailDurationDisplay = signal('flex');
  select = output<string>();
  static secondsInOneMinute = 60;
  static secondsInOneHour = VideoPlayerCardComponent.secondsInOneMinute * 60;
  static secondsInOneDay = VideoPlayerCardComponent.secondsInOneHour * 24;
  static secondsInOneMonth = VideoPlayerCardComponent.secondsInOneDay * 30;
  static secondsInOneYear = VideoPlayerCardComponent.secondsInOneMonth * 12;

  private player = viewChild(NativeYouTubePlayerComponent);
  private authService = inject(Auth);
  @HostListener('click')
  onClick() {
    this.select.emit(this.videoId());
  }

  onMouseEnter() {
    this.player()?.playVideo();
    this.thumbnailDurationDisplay.set('none');
  }

  onMouseLeave() {
    this.player()?.pauseVideo();
    this.thumbnailDurationDisplay.set('flex');
  }

  static computePublishDateString(date: Date) {
    let publishDateString = '';
    const dateDiffInSeconds = Math.floor(
      (new Date().getTime() - date.getTime()) / 1000,
    );
    let dateDiffNumber = 0;
    if (dateDiffInSeconds <= VideoPlayerCardComponent.secondsInOneMinute) {
      publishDateString += `${dateDiffInSeconds} second`;
      dateDiffNumber = dateDiffInSeconds;
    } else if (dateDiffInSeconds <= VideoPlayerCardComponent.secondsInOneHour) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / VideoPlayerCardComponent.secondsInOneMinute,
      );
      publishDateString += `${dateDiffInMinutes} minute`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (dateDiffInSeconds <= VideoPlayerCardComponent.secondsInOneDay) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / VideoPlayerCardComponent.secondsInOneHour,
      );
      publishDateString += `${dateDiffInMinutes} hour`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (
      dateDiffInSeconds <= VideoPlayerCardComponent.secondsInOneMonth
    ) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / VideoPlayerCardComponent.secondsInOneDay,
      );
      publishDateString += `${dateDiffInMinutes} day`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (dateDiffInSeconds <= VideoPlayerCardComponent.secondsInOneYear) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / VideoPlayerCardComponent.secondsInOneMonth,
      );
      publishDateString += `${dateDiffInMinutes} month`;
      dateDiffNumber = dateDiffInMinutes;
    } else {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / VideoPlayerCardComponent.secondsInOneYear,
      );
      publishDateString += `${dateDiffInMinutes} year`;
      dateDiffNumber = dateDiffInMinutes;
    }

    if (dateDiffNumber > 1) {
      publishDateString += 's';
    }

    publishDateString += ' ago';
    return publishDateString;
  }

  static computeViewCountString(viewCount: number) {
    let viewCountString = '';
    if (viewCount === 0) {
      viewCountString += 'No';
    } else if (viewCount <= 1000) {
      viewCountString = `${viewCount}`;
    } else if (viewCount <= 1000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}K`;
    } else if (viewCount <= 1000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}M`;
    } else if (viewCount <= 1000000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}B`;
    } else {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}T`;
    }
    viewCountString += ' view';
    if (viewCount > 1) {
      viewCountString += 's';
    }
    return viewCountString;
  }

  static hoursInIntervals = [24 * 365, 24 * 7, 24, 1];
  static computeDurationString(duration: string) {
    let durationString = '';
    const matches = duration.match(
      /P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/,
    );
    if (!matches) {
      return durationString;
    }

    let durationArrIndex = 0;
    let hours = 0;
    matches
      .slice(1)
      .map((_) => (_ ? parseInt(_.replace(/\D/, '')) : 0))
      .forEach((amount, index) => {
        if (index <= matches.length - 2 - 2) {
          hours +=
            amount *
            VideoPlayerCardComponent.hoursInIntervals[durationArrIndex++];
          if (index === matches.length - 2 - 2 && hours > 0) {
            durationString += `${hours}`;
          }
        } else {
          if (durationString !== '') {
            durationString += ':';
          }
          if (index === matches.length - 2 - 1 && durationString === '') {
            durationString += `${amount}`;
          } else {
            durationString += `${amount < 10 ? `0${amount}` : amount}`;
          }
        }
      });

    return durationString;
  }
}
