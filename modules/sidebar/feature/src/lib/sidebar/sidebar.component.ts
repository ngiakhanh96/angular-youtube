import {
  ISection,
  LogoMenuComponent,
  MenuComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'ay-sidebar',
  imports: [LogoMenuComponent, MatListModule, MatIconModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  //TODO handle filled icon on selected item
  menuItems = signal<ISection[]>([
    {
      sectionItems: [
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
      ],
    },
    {
      header: 'You',
      sectionItems: [
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
      ],
    },
    {
      header: 'You2',
      sectionItems: [
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
      ],
    },
    {
      header: 'You3',
      sectionItems: [
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
      ],
    },
  ]);

  selectedIconName = signal('home');
  router = inject(Router);

  onClickEffect = effect(() => {
    if (this.selectedIconName() === 'youtube-music') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  });
}
