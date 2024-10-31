import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import { SidebarService } from '@angular-youtube/shared-ui';
import { SidebarComponent } from '@angular-youtube/sidebar-feature';
import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [
    MasterHeaderComponent,
    BrowseComponent,
    MatSidenavModule,
    AsyncPipe,
    SidebarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  sidebarService = inject(SidebarService);
  media = inject(MediaMatcher);
  //TODO should change to 1312px later
  mobileQuery = this.media.matchMedia('(max-width: 950px)');
  mobileQueryMatches = signal(this.mobileQuery.matches);
  mode = computed(() => (this.mobileQueryMatches() ? 'over' : 'side'));
  showStartHeader = signal(true);
  constructor() {
    this.mobileQuery.onchange = (event: MediaQueryListEvent) => {
      this.mobileQueryMatches.set(event.matches);
      if (!event.matches) {
        if (this.mode() === 'side' && this.sidebarService.currentState) {
          this.showStartHeader.set(false);
        }
      } else {
        this.showStartHeader.set(true);
      }
    };
  }

  onOpenedChange(state: boolean) {
    this.sidebarService.setState(state);
  }

  onOpenedStart() {
    if (this.mode() === 'side') {
      this.showStartHeader.set(false);
    }
  }

  onClosedStart() {
    this.showStartHeader.set(true);
  }
}
