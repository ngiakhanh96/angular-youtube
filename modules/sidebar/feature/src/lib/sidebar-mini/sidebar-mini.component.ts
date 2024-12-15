import { selectMyChannelInfo } from '@angular-youtube/home-page-data-access';
import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  IconDirective,
  ISectionItem,
  SectionItemDirective,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'ay-sidebar-mini',
  imports: [MatListModule, MatIconModule, IconDirective, SectionItemDirective],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniComponent extends BaseWithSandBoxComponent {
  user = this.selectSignal(selectMyChannelInfo);
  isLoggedIn = computed(() => this.user() != null);
  menuItems = computed(() => {
    return this.isLoggedIn()
      ? this.loggedInMenuItems()
      : this.anonymousMenuItems();
  });

  anonymousMenuItems = signal<ISectionItem[]>([
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
    {
      iconName: 'you',
      displayText: 'You',
    },
    {
      iconName: 'history',
      displayText: 'History',
    },
  ]);

  //TODO handle filled icon on selected item
  loggedInMenuItems = signal<ISectionItem[]>([
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
  onClick(iconName: string) {
    this.selectedIconName.set(iconName);
    if (iconName === 'youtube-music-light') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  }
}
