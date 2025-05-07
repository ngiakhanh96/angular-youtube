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
          displayHtml: 'Home',
        },
        {
          iconName: 'shorts',
          displayHtml: 'Shorts',
        },
        {
          iconName: 'subscriptions',
          displayHtml: 'Subscriptions',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'you',
          displayHtml: 'You',
        },
        {
          iconName: 'history',
          displayHtml: 'History',
        },
      ],
    },
    {
      header: 'Explore',
      sectionItems: [
        {
          iconName: 'trending',
          displayHtml: 'Trending',
        },
        {
          iconName: 'music',
          displayHtml: 'Music',
        },
        {
          iconName: 'movies',
          displayHtml: 'Movies',
        },
        {
          iconName: 'gaming',
          displayHtml: 'Gaming',
        },
        {
          iconName: 'news',
          displayHtml: 'News',
        },
        {
          iconName: 'sports',
          displayHtml: 'Sports',
        },
        {
          iconName: 'fashion-and-beauty',
          displayHtml: 'Fashion & Beauty',
        },
        {
          iconName: 'podcasts',
          displayHtml: 'Podcasts',
        },
      ],
    },
    {
      header: 'More from YouTube',
      sectionItems: [
        {
          iconName: 'youtube-premium',
          displayHtml: 'YouTube Premium',
        },
        {
          iconName: 'youtube-music',
          displayHtml: 'YouTube Music',
        },
        {
          iconName: 'youtube-kids',
          displayHtml: 'YouTube Kids',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayHtml: 'Settings',
        },
        {
          iconName: 'report',
          displayHtml: 'Report History',
        },
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

  //TODO handle filled icon on selected item
  loggedInMenuItems = signal<ISection[]>([
    {
      sectionItems: [
        {
          iconName: 'home',
          displayHtml: 'Home',
        },
        {
          iconName: 'shorts',
          displayHtml: 'Shorts',
        },
        {
          iconName: 'subscriptions',
          displayHtml: 'Subscriptions',
        },
        {
          iconName: 'youtube-music-light',
          displayHtml: 'YouTube Music',
        },
      ],
    },
    {
      header: 'You',
      sectionItems: [
        {
          iconName: 'history',
          displayHtml: 'History',
        },
        {
          iconName: 'playlists',
          displayHtml: 'Playlists',
        },
        {
          iconName: 'your-videos',
          displayHtml: 'Your videos',
        },
        {
          iconName: 'watch-later',
          displayHtml: 'Watch later',
        },
        {
          iconName: 'liked-videos',
          displayHtml: 'Liked videos',
        },
        {
          iconName: 'downloads',
          displayHtml: 'Downloads',
        },
        {
          iconName: 'your-clips',
          displayHtml: 'Your clips',
        },
      ],
    },
    {
      header: 'Explore',
      sectionItems: [
        {
          iconName: 'trending',
          displayHtml: 'Trending',
        },
        {
          iconName: 'music',
          displayHtml: 'Music',
        },
        {
          iconName: 'movies',
          displayHtml: 'Movies',
        },
        {
          iconName: 'gaming',
          displayHtml: 'Gaming',
        },
        {
          iconName: 'news',
          displayHtml: 'News',
        },
        {
          iconName: 'sports',
          displayHtml: 'Sports',
        },
        {
          iconName: 'fashion-and-beauty',
          displayHtml: 'Fashion & Beauty',
        },
        {
          iconName: 'podcasts',
          displayHtml: 'Podcasts',
        },
      ],
    },
    {
      header: 'More from YouTube',
      sectionItems: [
        {
          iconName: 'youtube-studio',
          displayHtml: 'YouTube Studio',
        },
        {
          iconName: 'youtube-music',
          displayHtml: 'YouTube Music',
        },
        {
          iconName: 'youtube-kids',
          displayHtml: 'YouTube Kids',
        },
      ],
    },
    {
      sectionItems: [
        {
          iconName: 'settings',
          displayHtml: 'Settings',
        },
        {
          iconName: 'report',
          displayHtml: 'Report History',
        },
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

  menuItems = computed(() => {
    return this.isLoggedIn()
      ? this.loggedInMenuItems()
      : this.anonymousMenuItems();
  });
}
