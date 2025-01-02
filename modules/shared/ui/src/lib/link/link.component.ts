import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'ay-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class LinkComponent {
  cdr = inject(ChangeDetectorRef);
  static supportedSocialMedias = new Set([
    'www.twitch.com',
    'www.facebook.com',
    'www.twitter.com',
    'www.tiktok.com',
  ]);
  href = input.required<string>();
  prefix = signal('&nbsp;');
  suffix = signal(`&nbsp;/&nbsp;devenplaylist&nbsp;&nbsp;`);
}
