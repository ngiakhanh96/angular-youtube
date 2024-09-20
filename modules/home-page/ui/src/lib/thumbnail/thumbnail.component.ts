import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'ay-thumbnail',
  standalone: true,
  imports: [YouTubePlayer, NgOptimizedImage],
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

  constructor() {
    afterNextRender(() => {
      const youtubePlayerPlaceHolder =
        this.youtubePlayer()?.nativeElement.querySelector(
          'youtube-player-placeholder'
        );
      youtubePlayerPlaceHolder!.style.width = '100%';
      youtubePlayerPlaceHolder!.style.height = '100%';
      youtubePlayerPlaceHolder.style.borderRadius = '12px';
    });
  }
}
