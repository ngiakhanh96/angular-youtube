import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import {
  Auth,
  BaseWithSandBoxComponent,
  selectAccessTokenInfo,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
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
  effect,
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
export class LayoutComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  sidebarService = inject(SidebarService);
  media = inject(MediaMatcher);
  authService = inject(Auth);
  mobileQuery = this.media.matchMedia('(max-width: 1312px)');
  mobileQueryMatches = signal(this.mobileQuery.matches);
  mode = computed(() => (this.mobileQueryMatches() ? 'over' : 'side'));
  showStartHeader = computed(
    () => !this.sidebarService.isOpened() || this.mode() === 'over',
  );
  sidebarWidth = signal('236px');
  sidebarMiniWidth = signal('74px');
  sideNavContentWith = computed(() => {
    return this.showStartHeader()
      ? 'calc(100vw - var(--sidebar-mini-width))'
      : 'calc(100vw - var(--sidebar-width))';
  });
  accessTokenInfo = this.selectSignal(selectAccessTokenInfo);

  loginEffect = effect(() => {
    const accessToken = this.authService.accessToken();
    this.dispatchAction(
      sharedActionGroup.updateAccessToken({ accessToken: accessToken }),
    );
  });

  refreshTokenEffect = effect(() => {
    const accessTokenInfo = this.accessTokenInfo();
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

  ngOnInit() {
    this.mobileQuery.onchange = (event: MediaQueryListEvent) => {
      this.mobileQueryMatches.set(event.matches);
    };
  }

  onOpenedChange(state: boolean) {
    this.sidebarService.setState(state);
  }
}
