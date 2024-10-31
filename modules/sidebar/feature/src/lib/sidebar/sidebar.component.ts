import { IconDirective, LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SidebarItemContentComponent } from '../directives/sidebar-item-content/sidebar-item-content.component';
import { SidebarItemDirective } from '../directives/sidebar-item/sidebar-item.directive';
import { SidebarSectionHeaderComponent } from '../sidebar-section-header/sidebar-section-header.component';

export interface ISidebarMenuItem {
  iconName: string;
  displayText: string;
}

@Component({
  selector: 'ay-sidebar',
  standalone: true,
  imports: [
    LogoMenuComponent,
    MatListModule,
    MatIconModule,
    IconDirective,
    SidebarSectionHeaderComponent,
    SidebarItemDirective,
    SidebarItemContentComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
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
    // {
    //   iconName: 'you',
    //   displayText: 'You',
    // },
    // {
    //   iconName: 'downloads',
    //   displayText: 'Downloads',
    // },
  ]);

  youSidebarMenuItems = signal<ISidebarMenuItem[]>([
    {
      iconName: 'history',
      displayText: 'History',
    },
    {
      iconName: 'playlists',
      displayText: 'Playlists',
    },
    {
      iconName: 'your-videos',
      displayText: 'Your videos',
    },
    {
      iconName: 'watch-later',
      displayText: 'Watch later',
    },
    {
      iconName: 'liked-videos',
      displayText: 'Liked videos',
    },
    {
      iconName: 'downloads',
      displayText: 'Downloads',
    },
    {
      iconName: 'your-clips',
      displayText: 'Your clips',
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
