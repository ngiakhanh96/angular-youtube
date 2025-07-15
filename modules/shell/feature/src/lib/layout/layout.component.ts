import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import {
  Auth,
  BaseWithSandBoxComponent,
  sharedEventGroup,
} from '@angular-youtube/shared-data-access';
import { FixedTopDirective, SidebarService } from '@angular-youtube/shared-ui';
import {
  SidebarComponent,
  SidebarMiniComponent,
} from '@angular-youtube/sidebar-feature';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ay-layout',
  imports: [
    MasterHeaderComponent,
    MatSidenavModule,
    SidebarComponent,
    SidebarMiniComponent,
    RouterOutlet,
    FixedTopDirective,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    '[style.--sidenav-content-width]': 'sideNavContentWith()',
    '[style.--sidebar-mini-width]': 'sidebarMiniWidth()',
    '[style.--sidebar-width]': 'sidebarWidth()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  sidebarService = inject(SidebarService);
  media = inject(MediaMatcher);
  authService = inject(Auth);
  mobileQuery = this.media.matchMedia('(max-width: 1312px)');
  mobileQueryMatches = signal(this.mobileQuery.matches);
  mode = computed(() => {
    const mobileQuery = this.mobileQueryMatches();
    const showMiniSidebar = this.sidebarService.showMiniSidebar();
    return !showMiniSidebar || mobileQuery ? 'over' : 'side';
  });
  showStartHeader = computed(
    () => !this.sidebarService.isOpened() || this.mode() === 'over',
  );
  showMiniSidebar = computed(
    () => this.showStartHeader() && this.sidebarService.showMiniSidebar(),
  );
  sidebarWidth = signal('236px');

  sidebarMiniDefaultWidth = signal('74px');
  sidebarMiniWidth = computed(() =>
    this.sidebarService.showMiniSidebar()
      ? this.sidebarMiniDefaultWidth()
      : 'unset',
  );
  sideNavContentWith = computed(() => {
    return this.showStartHeader()
      ? this.sidebarService.showMiniSidebar()
        ? 'calc(100vw - var(--sidebar-mini-width))'
        : '100vw'
      : 'calc(100vw - var(--sidebar-width))';
  });
  updateAccessTokenEvent = computed(() =>
    sharedEventGroup.updateAccessToken({
      accessToken: this.authService.accessToken(),
    }),
  );

  refreshTokenEffect = effect(() => {
    const accessTokenInfo = this.sandbox.sharedStore.accessTokenInfo();
    //TODO find a way to get refresh token to get new access token silently
    if (accessTokenInfo) {
      const milisecondsDiff =
        accessTokenInfo.expired_datetime.getTime() - new Date().getTime();
      if (milisecondsDiff <= 10000) {
        this.authService.login();
      } else {
        setTimeout(() => {
          this.authService.login();
        }, milisecondsDiff - 10000);
      }
    }
  });

  constructor() {
    super();
    this.dispatchEventFromSignal(this.updateAccessTokenEvent);
  }

  ngOnInit() {
    this.mobileQuery.onchange = (event: MediaQueryListEvent) => {
      this.mobileQueryMatches.set(event.matches);
    };
  }

  onOpenedChange(state: boolean) {
    this.sidebarService.setState(state);
  }
}
