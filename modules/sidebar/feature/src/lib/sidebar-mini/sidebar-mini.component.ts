import { IconDirective } from '@angular-youtube/shared-ui';
import { SidebarItemDirective } from '@angular-youtube/sidebar-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { ISidebarMenuItem } from '../sidebar/sidebar.component';

@Component({
  selector: 'ay-sidebar-mini',
  standalone: true,
  imports: [MatListModule, MatIconModule, IconDirective, SidebarItemDirective],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniComponent {
  //TODO handle filled icon on selected item
  entrySidebarMenuItems = signal<ISidebarMenuItem[]>([
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

  selectedMenuItem = 'home';
  router = inject(Router);
  onClick(menuItem: string) {
    this.selectedMenuItem = menuItem;
    if (menuItem === 'youtube-music') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  }
}
