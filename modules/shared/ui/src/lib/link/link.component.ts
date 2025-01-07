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
  static supportedSocialMedias = new Map([
    ['www.twitch.com', 'social_media/twitch_1x.png'],
    ['www.facebook.com', 'social_media/facebook_1x.png'],
    ['www.twitter.com', 'social_media/twitter_1x.png'],
    ['www.tiktok.com', 'social_media/tiktok_1x.png'],
    ['www.discord.com', 'social_media/discord_1x.png'],
    ['www.spotify.com', 'social_media/spotify_1x.png'],
    ['localhost', 'yt_favicon_ringo2.png'],
  ]);
  document = inject(DOCUMENT);
  router = inject(Router);
  href = input.required<string>();
  attributeHref = input.required<string>();
  text = input<string>();
  currentVideoId = input<string | undefined>();
  isSupportedSocialMedia = computed(() => {
    const url = new URL(this.href());
    return LinkComponent.supportedSocialMedias.get(url.hostname);
  });
  prefix = signal('\u00a0');
  isCurrentYoutubeVideo = computed(() => {
    const url = new URL(this.href());
    const currentVideoId = this.currentVideoId();
    return (
      url.hostname === 'localhost' &&
      url.pathname.startsWith('/watch') &&
      url.searchParams.get('v') === currentVideoId
    );
  });
  isYoutubeHashTagLink = computed(() => {
    const url = new URL(this.href());
    return url.hostname === 'localhost' && url.pathname.startsWith('/hashtag');
  });
  isYoutubeChannelLink = computed(() => {
    const url = new URL(this.href());
    return url.hostname === 'localhost' && url.pathname.startsWith('/channel');
  });
  suffix = computed(() => {
    const isCurrentYoutubeVideo = this.isCurrentYoutubeVideo();
    const isYoutubeChannelLink = this.isYoutubeChannelLink();
    const text = this.text()?.trimStart() ?? '';
    return isCurrentYoutubeVideo || isYoutubeChannelLink
      ? `\u00a0${text}\u00a0\u00a0`
      : `\u00a0/\u00a0${this.href()
          .substring(this.href().lastIndexOf('/') + 1)
          .replace('@', '')}\u00a0\u00a0`;
  });
  imgSource = computed(() => {
    return `https://www.gstatic.com/youtube/img/watch/${this.isSupportedSocialMedia()}`;
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
    return this.isSupportedSocialMedia() &&
      !this.isCurrentYoutubeVideo() &&
      !this.isYoutubeHashTagLink()
      ? 'var(--black-color)'
      : 'rgb(6,95,212)';
  });

  backgroundColor = computed(() => {
    return this.isSupportedSocialMedia() &&
      !this.isCurrentYoutubeVideo() &&
      !this.isYoutubeHashTagLink()
      ? 'rgba(0,0,0,0.051)'
      : 'transparent';
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
    (<any>this.document.defaultView?.open(this.href(), '_blank'))?.focus();
  }

  target = computed(() => {
    const url = this.href().split('?')[0];
    if (url === <any>this.document.defaultView!.location.href.split('?')[0]) {
      return '_self';
    }
    return '_blank';
  });

  private convertQueryStringToParams(queryString: string): {
    [key: string]: string;
  } {
    return queryString.split('&').reduce(
      (params, param) => {
        const [key, value] = param.split('=');
        params[key] = value;
        return params;
      },
      {} as { [key: string]: string },
    );
  }
}
