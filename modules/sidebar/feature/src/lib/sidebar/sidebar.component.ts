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

export interface ISidebarMenuItem {
  iconName: string;
  displayText: string;
}

@Component({
  selector: 'ay-sidebar',
  standalone: true,
  imports: [LogoMenuComponent, MatListModule, MatIconModule, IconDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  sidebarMenuItems = signal<ISidebarMenuItem[]>([
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

  selectedMenuItem = 'home';
  router = inject(Router);
  onClick(menuItem: string) {
    console.log(menuItem);
    if (menuItem === 'youtube-music') {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: 'https://music.youtube.com/' },
        skipLocationChange: true,
      });
    }
  }
}
