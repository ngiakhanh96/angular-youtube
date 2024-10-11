import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { StartHeaderComponent } from '@angular-youtube/header-ui';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import { SidebarService } from '@angular-youtube/shared-ui';
import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [
    MasterHeaderComponent,
    BrowseComponent,
    MatSidenavModule,
    AsyncPipe,
    MatListModule,
    StartHeaderComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
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
