import { selectMyChannelInfo } from '@angular-youtube/home-page-data-access';
import {
  ISection,
  LogoMenuComponent,
  MenuComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BaseSidebarComponent } from '../base-sidebar.component';

@Component({
  selector: 'ay-sidebar',
  imports: [LogoMenuComponent, MatListModule, MatIconModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent extends BaseSidebarComponent {
  user = this.selectSignal(selectMyChannelInfo);
  isLoggedIn = computed(() => this.user() != null);
  anonymousMenuItems = signal<ISection[]>([
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
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'you',
          displayText: 'You',
        },
        {
          iconName: 'history',
          displayText: 'History',
        },
      ],
    },
    {
      header: 'Explore',
      sectionItems: [
        {
          iconName: 'trending',
          displayText: 'Trending',
        },
        {
          iconName: 'music',
          displayText: 'Music',
        },
        {
          iconName: 'movies',
          displayText: 'Movies',
        },
        {
          iconName: 'gaming',
          displayText: 'Gaming',
        },
        {
          iconName: 'news',
          displayText: 'News',
        },
        {
          iconName: 'sports',
          displayText: 'Sports',
        },
        {
          iconName: 'fashion-and-beauty',
          displayText: 'Fashion & Beauty',
        },
        {
          iconName: 'podcasts',
          displayText: 'Podcasts',
        },
      ],
    },
    {
      header: 'More from YouTube',
      sectionItems: [
        {
          iconName: 'youtube-premium',
          displayText: 'YouTube Premium',
        },
        {
          iconName: 'youtube-music',
          displayText: 'YouTube Music',
        },
        {
          iconName: 'youtube-kids',
          displayText: 'YouTube Kids',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayText: 'Settings',
        },
        {
          iconName: 'report',
          displayText: 'Report History',
        },
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

  //TODO handle filled icon on selected item
  loggedInMenuItems = signal<ISection[]>([
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
          iconName: 'youtube-music-light',
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
      header: 'Explore',
      sectionItems: [
        {
          iconName: 'trending',
          displayText: 'Trending',
        },
        {
          iconName: 'music',
          displayText: 'Music',
        },
        {
          iconName: 'movies',
          displayText: 'Movies',
        },
        {
          iconName: 'gaming',
          displayText: 'Gaming',
        },
        {
          iconName: 'news',
          displayText: 'News',
        },
        {
          iconName: 'sports',
          displayText: 'Sports',
        },
        {
          iconName: 'fashion-and-beauty',
          displayText: 'Fashion & Beauty',
        },
        {
          iconName: 'podcasts',
          displayText: 'Podcasts',
        },
      ],
    },
    {
      header: 'More from YouTube',
      sectionItems: [
        {
          iconName: 'youtube-studio',
          displayText: 'YouTube Studio',
        },
        {
          iconName: 'youtube-music',
          displayText: 'YouTube Music',
        },
        {
          iconName: 'youtube-kids',
          displayText: 'YouTube Kids',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayText: 'Settings',
        },
        {
          iconName: 'report',
          displayText: 'Report History',
        },
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

  menuItems = computed(() => {
    return this.isLoggedIn()
      ? this.loggedInMenuItems()
      : this.anonymousMenuItems();
  });
}
