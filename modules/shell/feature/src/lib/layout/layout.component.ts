import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import { SidebarService } from '@angular-youtube/shared-ui';
import {
  SidebarComponent,
  SidebarMiniComponent,
} from '@angular-youtube/sidebar-feature';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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
    SidebarComponent,
    SidebarMiniComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    '[style.--sidebar-width]': 'sidebarWidth()',
    '[style.--sidebar-mini-width]': 'sidebarMiniWidth()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  sidebarService = inject(SidebarService);
  media = inject(MediaMatcher);
  //TODO should change to 1312px later
  mobileQuery = this.media.matchMedia('(max-width: 950px)');
  mobileQueryMatches = signal(this.mobileQuery.matches);
  mode = computed(() => (this.mobileQueryMatches() ? 'over' : 'side'));
  showStartHeader = computed(() => !this.sidebarService.isOpened());
  sidebarWidth = signal('237px');
  sidebarMiniWidth = signal('66px');

  ngOnInit() {
    this.mobileQuery.onchange = (event: MediaQueryListEvent) => {
      this.mobileQueryMatches.set(event.matches);
    };
  }

  onOpenedChange(state: boolean) {
    this.sidebarService.setState(state);
  }
}
