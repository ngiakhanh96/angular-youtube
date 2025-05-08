import { IMyChannelInfo } from '@angular-youtube/shared-data-access';
import {
  DropdownButtonComponent,
  ISection,
  OverlayDirective,
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
  TextIconButtonComponent,
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

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
    DropdownButtonComponent,
    LoginButtonComponent,
    OverlayModule,
    AccountMenuComponent,
    OverlayDirective,
    TextIconButtonComponent,
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
          displayHtml: 'Your data in Youtube',
        },
        {
          iconName: 'appearance',
          displayHtml: 'Appearance: Device theme',
        },
        {
          iconName: 'language',
          displayHtml: 'Language: English',
        },
        {
          iconName: 'restricted-mode',
          displayHtml: 'Restricted Mode: Off',
        },
        {
          iconName: 'location',
          displayHtml: 'Location: Singapore',
        },
        {
          iconName: 'keyboard-shortcuts',
          displayHtml: 'Keyboard shortcuts',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayHtml: 'Settings',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'help',
          displayHtml: 'Help',
        },
        {
          iconName: 'send-feedback',
          displayHtml: 'Send feedback',
        },
      ],
    },
  ]);
}
