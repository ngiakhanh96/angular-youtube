import { Auth, IMyChannelInfo } from '@angular-youtube/shared-data-access';
import {
  DropdownButtonComponent,
  ISection,
  OverlayDirective,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { AccountAvatarComponent } from '../account-avatar/account-avatar.component';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { LoginButtonComponent } from '../login-button/login-button.component';

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  imports: [
    DropdownButtonComponent,
    LoginButtonComponent,
    OverlayModule,
    AccountMenuComponent,
    OverlayDirective,
    TextIconButtonComponent,
    AccountAvatarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<IMyChannelInfo | undefined>();
  public userThumbnail = computed(
    () =>
      this.user()?.items[0].snippet.thumbnails.default.url ??
      'https://yt3.ggpht.com/a/default-user',
  );
  auth = inject(Auth);
  public isLoggedIn = computed(() => this.auth.isLoggedIn());
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
          displayHtml: `Location: Singapore`,
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
