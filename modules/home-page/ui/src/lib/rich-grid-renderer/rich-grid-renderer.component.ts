import {
  SettingsButtonComponent,
  YouTubePlayerComponent,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ay-rich-grid-renderer',
  standalone: true,
  imports: [YouTubePlayerComponent, NgOptimizedImage, SettingsButtonComponent],
  templateUrl: './rich-grid-renderer.component.html',
  styleUrls: ['./rich-grid-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichGridRenderComponent {
  videoId = input.required<string>();
  title = input.required<string>();
  channelName = input.required<string>();
  viewCount = input.required<number>();
  viewCountString = computed(() =>
    RichGridRenderComponent.computeViewCountString(this.viewCount())
  );
  publishedDate = input.required<Date>();
  publishDateString = computed(() =>
    RichGridRenderComponent.computePublishDateString(this.publishedDate())
  );
  duration = input.required<string>();
  durationString = computed(() =>
    RichGridRenderComponent.computeDurationString(this.duration())
  );
  channelLogoUrl = input.required<string>();
  _player = viewChild.required(YouTubePlayerComponent);
  playerVars = signal(<YT.PlayerVars>{
    autohide: <YT.AutoHide.HideAllControls>1,
    autoplay: <YT.AutoPlay.NoAutoPlay>0,
    cc_load_policy: <YT.ClosedCaptionsLoadPolicy.ForceOn>1,
    cc_lang_pref: undefined,
    color: 'red',
    controls: <YT.Controls.ShowLoadPlayer>1,
    disablekb: <YT.KeyboardControls.Disable>1,
    enablejsapi: <YT.JsApi.Enable>1,
    fs: <YT.FullscreenButton.Hide>0,
    hl: undefined,
    iv_load_policy: undefined,
    list: undefined,
    listType: undefined,
    loop: <YT.Loop.SinglePlay>0,
    modestbranding: <YT.ModestBranding.Modest>1,
    mute: <YT.Mute.Muted>1,
    origin: undefined,
    playlist: undefined,
    playsinline: <YT.PlaysInline.Inline>1,
    rel: <YT.RelatedVideos.Hide>0,
    showinfo: <YT.ShowInfo.Hide>0,
    start: undefined,
    end: undefined,
  });
  thumbnailDurationDisplay = signal('flex');
  static secondsInOneMinute = 60;
  static secondsInOneHour = RichGridRenderComponent.secondsInOneMinute * 60;
  static secondsInOneDay = RichGridRenderComponent.secondsInOneHour * 24;
  static secondsInOneMonth = RichGridRenderComponent.secondsInOneDay * 30;
  static secondsInOneYear = RichGridRenderComponent.secondsInOneMonth * 12;
  _isAlreadyPlayedOnce = false;
  _isReady = false;
  _onMouseEnterInterval?: number;
  _playVideoInterval?: number;
  onMouseEnter() {
    if (this._isReady) {
      if (this._player()?.getPlayerState() !== <YT.PlayerState.PLAYING>1) {
        this._playVideoInterval ??= window.setInterval(() => {
          if (this._player()?.getPlayerState() !== <YT.PlayerState.PLAYING>1) {
            this._player()?.playVideo(true);
          } else {
            clearInterval(this._playVideoInterval);
            this._playVideoInterval = undefined;
          }
        }, 50);
      }

      if (!this._isAlreadyPlayedOnce) {
        this.thumbnailDurationDisplay.set('none');
        this._isAlreadyPlayedOnce = true;
      }
      clearInterval(this._onMouseEnterInterval);
      this._onMouseEnterInterval = undefined;
    } else {
      this._onMouseEnterInterval ??= window.setInterval(
        () => this.onMouseEnter(),
        100
      );
    }
  }

  onMouseLeave() {
    clearInterval(this._onMouseEnterInterval);
    clearInterval(this._playVideoInterval);
    this._onMouseEnterInterval = undefined;
    this._playVideoInterval = undefined;
    this._player()?.pauseVideo();
  }

  onReady() {
    this._isReady = true;
  }

  static computePublishDateString(date: Date) {
    let publishDateString = '';
    const dateDiffInSeconds = Math.floor(
      (new Date().getTime() - date.getTime()) / 1000
    );
    let dateDiffNumber = 0;
    if (dateDiffInSeconds <= RichGridRenderComponent.secondsInOneMinute) {
      publishDateString += `${dateDiffInSeconds} second`;
      dateDiffNumber = dateDiffInSeconds;
    } else if (dateDiffInSeconds <= RichGridRenderComponent.secondsInOneHour) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / RichGridRenderComponent.secondsInOneMinute
      );
      publishDateString += `${dateDiffInMinutes} minute`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (dateDiffInSeconds <= RichGridRenderComponent.secondsInOneDay) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / RichGridRenderComponent.secondsInOneHour
      );
      publishDateString += `${dateDiffInMinutes} hour`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (dateDiffInSeconds <= RichGridRenderComponent.secondsInOneMonth) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / RichGridRenderComponent.secondsInOneDay
      );
      publishDateString += `${dateDiffInMinutes} day`;
      dateDiffNumber = dateDiffInMinutes;
    } else if (dateDiffInSeconds <= RichGridRenderComponent.secondsInOneYear) {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / RichGridRenderComponent.secondsInOneMonth
      );
      publishDateString += `${dateDiffInMinutes} month`;
      dateDiffNumber = dateDiffInMinutes;
    } else {
      const dateDiffInMinutes = Math.floor(
        dateDiffInSeconds / RichGridRenderComponent.secondsInOneYear
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
    if (viewCount <= 1000) {
      viewCountString = `${viewCount}`;
    } else if (viewCount <= 1000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}K`;
    } else if (viewCount <= 1000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}M`;
    } else if (viewCount <= 1000000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint
        );
      }
      viewCountString = `${roundedViewCountToOneDecimalPoint}B`;
    } else {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((viewCount / 1000000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint
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
      /P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/
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
            RichGridRenderComponent.hoursInIntervals[durationArrIndex++];
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
