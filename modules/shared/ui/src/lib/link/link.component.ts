import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

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
    ['www.twitch.com', 'twitch'],
    ['www.facebook.com', 'facebook'],
    ['www.twitter.com', 'twitter'],
    ['www.tiktok.com', 'tiktok'],
    ['www.discord.com', 'discord'],
    ['www.spotify.com', 'spotify'],
  ]);
  href = input.required<string>();
  attributeHref = input.required<string>();
  text = input<string>();
  isSupportedSocialMedia = computed(() => {
    const url = new URL(this.href());
    return LinkComponent.supportedSocialMedias.get(url.host);
  });
  prefix = signal('\u00a0');
  suffix = computed(
    () =>
      `\u00a0/\u00a0${this.href()
        .substring(this.href().lastIndexOf('/') + 1)
        .replace('@', '')}\u00a0\u00a0`,
  );
  imgSource = computed(() => {
    return `https://www.gstatic.com/youtube/img/watch/social_media/${this.isSupportedSocialMedia()}_1x.png`;
  });
  formattedText = computed(() => {
    const attributeHref = this.attributeHref();
    if (attributeHref.startsWith('https')) {
      return 'https://' + this.text();
    } else if (attributeHref.startsWith('http')) {
      return 'http://' + this.text();
    }
    return this.text();
  });
  color = computed(() => {
    return this.isSupportedSocialMedia()
      ? 'var(--black-color)'
      : 'rgb(6,95,212)';
  });

  backgroundColor = computed(() => {
    return this.isSupportedSocialMedia() ? 'rgba(0,0,0,0.051)' : 'transparent';
  });
}
