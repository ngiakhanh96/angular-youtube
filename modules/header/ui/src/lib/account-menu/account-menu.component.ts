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
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'ay-account-menu',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    IconDirective,
    SidebarItemDirective,
    SidebarItemContentComponent,
  ],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent {
  //TODO handle filled icon on selected item
  entrySidebarMenuItems = signal<IMenuItem[]>([
    {
      iconName: 'home',
      displayText: 'Home',
    },
    {
      iconName: 'shorts',
      displayText: 'Shorts',
    },
    {
      iconName: 'subscriptions',
      displayText: 'Subscriptions',
    },
    {
      iconName: 'youtube-music',
      displayText: 'Youtube Music',
    },
    {
      iconName: 'you',
      displayText: 'You',
    },
    {
      iconName: 'downloads',
      displayText: 'Downloads',
    },
  ]);

  selectedIconName = signal('home');
  router = inject(Router);
  onClick(menuItem: string) {
    this.selectedIconName.set(menuItem);
  }
}
