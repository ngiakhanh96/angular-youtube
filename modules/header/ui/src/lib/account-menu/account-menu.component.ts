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
          displayText: 'Google Account',
        },
        {
          iconName: 'switch-account',
          displayText: 'Switch account',
        },
        {
          iconName: 'sign-out',
          displayText: 'Sign out',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'youtube-studio',
          displayText: 'Youtube Studio',
        },
        {
          iconName: 'youtube-premium-benefits',
          displayText: 'Your Premium benefits',
        },
        {
          iconName: 'purchases-and-memberships',
          displayText: 'Purchases and memberships',
        },
      ],
    },
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

  selectedIconName = signal('');
  onClick(menuItem: string) {
    this.selectedIconName.set(menuItem);
  }
}
