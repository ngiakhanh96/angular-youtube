import { SocialUser } from '@abacritt/angularx-social-login';
import { IconDirective } from '@angular-youtube/shared-ui';
import { IMenuItem } from '@angular-youtube/sidebar-feature';
import {
  SidebarItemContentComponent,
  SidebarItemDirective,
} from '@angular-youtube/sidebar-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AccountQuickInfoComponent } from '../account-quick-info/account-quick-info.component';

@Component({
  selector: 'ay-account-menu',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    IconDirective,
    SidebarItemDirective,
    SidebarItemContentComponent,
    AccountQuickInfoComponent,
  ],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent {
  public user = input.required<SocialUser | undefined>();
  accountMenuItems = signal<IMenuItem[]>([
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
  ]);

  youtubeMenuItems = signal<IMenuItem[]>([
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
  ]);

  languageAndAppearanceMenuItems = signal<IMenuItem[]>([
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
  ]);

  settingsMenuItems = signal<IMenuItem[]>([
    {
      iconName: 'settings',
      displayText: 'Settings',
    },
  ]);

  helpAndFeedbackMenuItems = signal<IMenuItem[]>([
    {
      iconName: 'help',
      displayText: 'Help',
    },
    {
      iconName: 'send-feedback',
      displayText: 'Send feedback',
    },
  ]);

  selectedIconName = signal('');
  router = inject(Router);
  onClick(menuItem: string) {
    this.selectedIconName.set(menuItem);
  }
}
