import { IMyChannelInfo } from '@angular-youtube/shared-data-access';
import { ISection, MenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AccountQuickInfoComponent } from '../account-quick-info/account-quick-info.component';

@Component({
  selector: 'ay-account-menu',
  imports: [
    MatListModule,
    MatIconModule,
    AccountQuickInfoComponent,
    MenuComponent,
  ],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent {
  public user = input.required<IMyChannelInfo | undefined>();
  menuItems = signal<ISection[]>([
    {
      sectionItems: [
        {
          iconName: 'google-account',
          displayHtml: 'Google Account',
        },
        {
          iconName: 'switch-account',
          displayHtml: 'Switch account',
        },
        {
          iconName: 'sign-out',
          displayHtml: 'Sign out',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'youtube-studio',
          displayHtml: 'Youtube Studio',
        },
        {
          iconName: 'youtube-premium-benefits',
          displayHtml: 'Your Premium benefits',
        },
        {
          iconName: 'purchases-and-memberships',
          displayHtml: 'Purchases and memberships',
        },
      ],
    },
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

  selectedIconName = signal('');
}
