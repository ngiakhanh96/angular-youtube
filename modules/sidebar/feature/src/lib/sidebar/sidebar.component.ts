import { IconDirective, LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  SidebarItemContentComponent,
  SidebarItemDirective,
  SidebarSectionHeaderComponent,
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
