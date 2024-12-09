import { IMyChannelInfo } from '@angular-youtube/shared-data-access';
import {
  ISection,
  OverlayDirective,
  SettingsButtonComponent,
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { LoginButtonComponent } from '../login-button/login-button.component';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
    SettingsButtonComponent,
    LoginButtonComponent,
    OverlayModule,
    AccountMenuComponent,
    OverlayDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<IMyChannelInfo | undefined>();
  public userThumbnail = computed(
    () => this.user()?.items[0].snippet.thumbnails.default.url,
  );
  public isLoggedIn = computed(() => this.user() != null);
  public isOpenedAvatarMenu = signal(false);
  settingItems = signal<ISection[]>([
    {
      sectionItems: [
        {
          iconName: 'data-in-youtube',
          displayText: 'Your data in Youtube',
        },
        {
          iconName: 'appearance',
          displayText: 'Appearance: Device theme',
        },
        {
          iconName: 'language',
          displayText: 'Language: English',
        },
        {
          iconName: 'restricted-mode',
          displayText: 'Restricted Mode: Off',
        },
        {
          iconName: 'location',
          displayText: 'Location: Singapore',
        },
        {
          iconName: 'keyboard-shortcuts',
          displayText: 'Keyboard shortcuts',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayText: 'Settings',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'help',
          displayText: 'Help',
        },
        {
          iconName: 'send-feedback',
          displayText: 'Send feedback',
        },
      ],
    },
  ]);

  onClickAvatar() {
    this.isOpenedAvatarMenu.update((v) => !v);
  }

  onOverlayOutsideClick() {
    this.isOpenedAvatarMenu.update((v) => !v);
  }
}
