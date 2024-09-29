import { YouTubePlayerComponent } from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'ay-thumbnail',
  standalone: true,
  imports: [YouTubePlayerComponent, NgOptimizedImage],
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
})
export class ThumbnailComponent {
  videoId = input.required<string>();
  title = input.required<string>();
  channelName = input.required<string>();
  viewCount = input.required<number>();
  publishedDate = input.required<Date>();
  duration = input<number>();
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
  _isAlreadyPlayedOnce = false;
  onMouseEnter() {
    if (this._player().getPlayerState() !== <YT.PlayerState.PLAYING>1) {
      this._player()?.playVideo(true);
    }
    if (!this._isAlreadyPlayedOnce) {
      this._player()?.playVideo(true);
      this.thumbnailDurationDisplay.set('none');
      this._isAlreadyPlayedOnce = true;
    }
  }

  onMouseLeave() {
    this._player()?.pauseVideo();
  }
}
