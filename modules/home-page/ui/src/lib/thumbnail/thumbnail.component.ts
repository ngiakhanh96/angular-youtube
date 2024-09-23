import { YouTubePlayerComponent } from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, input, viewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'ay-thumbnail',
  standalone: true,
  imports: [YouTubePlayerComponent, NgOptimizedImage],
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
})
export class ThumbnailComponent {
  youtubePlayer = viewChild(YouTubePlayer, { read: ElementRef });
  videoId = input.required<string>();
  title = input.required<string>();
  channelName = input.required<string>();
  viewCount = input.required<number>();
  publishedDate = input.required<Date>();
  duration = input<number>();
  channelLogoUrl = input.required<string>();
  playerVars = <YT.PlayerVars>{
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
    showinfo: undefined,
    start: undefined,
    end: undefined,
  };
}
