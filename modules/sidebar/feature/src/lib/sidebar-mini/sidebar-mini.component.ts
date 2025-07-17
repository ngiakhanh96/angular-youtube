import {
  IconDirective,
  ISectionItem,
  SectionItemDirective,
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
  selector: 'ay-sidebar-mini',
  imports: [MatListModule, MatIconModule, IconDirective, SectionItemDirective],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniComponent extends BaseSidebarComponent {
  isLoggedIn = computed(() => this.sandbox.sharedStore.myChannelInfo() != null);
  menuItems = computed(() => {
    return this.isLoggedIn()
      ? this.loggedInMenuItems()
      : this.anonymousMenuItems();
  });

  anonymousMenuItems = signal<ISectionItem[]>([
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
    {
      iconName: 'you',
      displayHtml: 'You',
    },
    {
      iconName: 'history',
      displayHtml: 'History',
    },
  ]);

  //TODO handle filled icon on selected item
  loggedInMenuItems = signal<ISectionItem[]>([
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
    {
      iconName: 'you',
      displayHtml: 'You',
    },
    {
      iconName: 'downloads',
      displayHtml: 'Downloads',
    },
  ]);
}
