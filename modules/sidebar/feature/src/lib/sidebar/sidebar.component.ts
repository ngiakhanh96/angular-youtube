import {
  IconDirective,
  ISectionItem,
  LogoMenuComponent,
  SectionItemContentComponent,
  SectionItemDirective,
} from '@angular-youtube/shared-ui';
import { SidebarSectionHeaderComponent } from '@angular-youtube/sidebar-ui';
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
  selector: 'ay-sidebar',
  standalone: true,
  imports: [
    LogoMenuComponent,
    MatListModule,
    MatIconModule,
    IconDirective,
    SidebarSectionHeaderComponent,
    SectionItemDirective,
    SectionItemContentComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  //TODO handle filled icon on selected item
  entrySidebarMenuItems = signal<ISectionItem[]>([
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
      displayText: 'YouTube Music',
    },
  ]);

  youSidebarMenuItems = signal<ISectionItem[]>([
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

  selectedIconName = signal('home');
  router = inject(Router);
  onClick(iconName: string) {
    this.selectedIconName.set(iconName);
    if (iconName === 'youtube-music') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  }
}
