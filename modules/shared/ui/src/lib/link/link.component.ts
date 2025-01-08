import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ExternalNavigationService } from '../services/external-navigation.service';

@Component({
  selector: 'ay-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  host: {
    '[style.--color]': 'color()',
    '[style.--background-color]': 'backgroundColor()',
  },
})
export class LinkComponent {
  document = inject(DOCUMENT);
  externalNavigationService = inject(ExternalNavigationService);
  currentHostName = this.document.defaultView?.location.hostname;
  supportedSocialMedias = new Map([
    ['www.twitch.com', 'social_media/twitch_1x.png'],
    ['www.facebook.com', 'social_media/facebook_1x.png'],
    ['www.twitter.com', 'social_media/twitter_1x.png'],
    ['www.tiktok.com', 'social_media/tiktok_1x.png'],
    ['www.discord.com', 'social_media/discord_1x.png'],
    ['www.spotify.com', 'social_media/spotify_1x.png'],
    [this.currentHostName, 'yt_favicon_ringo2.png'],
  ]);
  router = inject(Router);
  href = input.required<string>();
  attributeHref = input.required<string>();
  text = input<string>();
  currentVideoId = input<string | undefined>();
  isFromYoutube = computed(() => {
    const url = new URL(this.href());
    return url.hostname === this.currentHostName;
  });
  isNonYoutubeSupportedSocialMedia = computed(() => {
    const url = new URL(this.href());
    const isFromYoutube = this.isFromYoutube();
    return this.supportedSocialMedias.has(url.hostname) && !isFromYoutube;
  });
  isOtherYoutubeVideo = computed(() => {
    const url = new URL(this.href());
    const currentVideoId = this.currentVideoId();
    const isFromYoutube = this.isFromYoutube();
    return (
      isFromYoutube &&
      url.pathname.startsWith('/watch') &&
      url.searchParams.get('v') !== currentVideoId
    );
  });
  isYoutubeChannelLink = computed(() => {
    const url = new URL(this.href());
    const isFromYoutube = this.isFromYoutube();
    return isFromYoutube && url.pathname.startsWith('/channel');
  });
  shouldShowIcon = computed(() => {
    const isNonYoutubeSupportedSocialMedia =
      this.isNonYoutubeSupportedSocialMedia();
    const isYoutubeChannelLink = this.isYoutubeChannelLink();
    const isOtherYoutubeVideo = this.isOtherYoutubeVideo();
    return (
      isNonYoutubeSupportedSocialMedia ||
      isYoutubeChannelLink ||
      isOtherYoutubeVideo
    );
  });
  prefix = signal('\u00a0');
  suffix = computed(() => {
    const isNonYoutubeSupportedSocialMedia =
      this.isNonYoutubeSupportedSocialMedia();
    const text = this.text()?.trimStart() ?? '';
    return isNonYoutubeSupportedSocialMedia
      ? `\u00a0/\u00a0${this.href()
          .substring(this.href().lastIndexOf('/') + 1)
          .replace('@', '')}\u00a0\u00a0`
      : `\u00a0${text}\u00a0\u00a0`;
  });
  imgSource = computed(() => {
    return `https://www.gstatic.com/youtube/img/watch/${this.supportedSocialMedias.get(new URL(this.href()).hostname)}`;
  });
  formattedText = computed(() => {
    const attributeHref = this.attributeHref();
    const text = this.text();
    if (attributeHref.startsWith('https') && !text?.startsWith('https')) {
      return 'https://' + this.text();
    } else if (attributeHref.startsWith('http') && !text?.startsWith('http')) {
      return 'http://' + this.text();
    }
    return this.text();
  });
  color = computed(() => {
    return this.shouldShowIcon() ? 'var(--black-color)' : 'rgb(6,95,212)';
  });

  backgroundColor = computed(() => {
    return this.shouldShowIcon() ? 'rgba(0,0,0,0.051)' : 'transparent';
  });

  onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.attributeHref().startsWith('/')) {
      const [path, queryString] = this.attributeHref().split('?');
      const queryParams = queryString
        ? this.convertQueryStringToParams(queryString)
        : {};

      this.router.navigate([path], { queryParams });
      return;
    }
    this.externalNavigationService.navigateByOpeningNewWindow(this.href());
  }

  target = computed(() => {
    const url = this.href().split('?')[0];
    if (url === this.document.defaultView?.location.href.split('?')[0]) {
      return '_self';
    }
    return '_blank';
  });

  private convertQueryStringToParams(
    queryString: string,
  ): Record<string, string> {
    return queryString.split('&').reduce(
      (params, param) => {
        const [key, value] = param.split('=');
        params[key] = value;
        return params;
      },
      {} as Record<string, string>,
    );
  }
}
