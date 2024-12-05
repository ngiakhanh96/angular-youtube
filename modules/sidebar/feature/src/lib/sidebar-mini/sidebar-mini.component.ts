import {
  IconDirective,
  ISectionItem,
  SectionItemDirective,
} from '@angular-youtube/shared-ui';
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
    selector: 'ay-sidebar-mini',
    imports: [MatListModule, MatIconModule, IconDirective, SectionItemDirective],
    templateUrl: './sidebar-mini.component.html',
    styleUrl: './sidebar-mini.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarMiniComponent {
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
    if (iconName === 'youtube-music') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  }
}
