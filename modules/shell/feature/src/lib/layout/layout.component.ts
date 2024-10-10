import { MasterHeaderComponent } from '@angular-youtube/header-feature';
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
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  media = inject(MediaMatcher);
  mobileQuery = this.media.matchMedia('(max-width: 600px)');
  mobileQueryMatches = signal(this.mobileQuery.matches);
  mode = computed(() => (this.mobileQueryMatches() ? 'over' : 'side'));
  sidebarService = inject(SidebarService);
  constructor() {
    this.mobileQuery.onchange = (event: MediaQueryListEvent) => {
      this.mobileQueryMatches.set(event.matches);
    };
  }
}
