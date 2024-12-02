import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import { selectMyChannelInfo } from '@angular-youtube/home-page-data-access';
import {
  Auth,
  BaseWithSandBoxComponent,
  IMyChannelInfo,
  loginActionGroup,
} from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';

@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  standalone: true,
  imports: [LogoMenuComponent, CenterHeaderComponent, EndHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--logo-menu-width]': 'logoMenuWidth()',
  },
})
export class MasterHeaderComponent extends BaseWithSandBoxComponent {
  showStartHeader = input.required();
  mode = input.required<string>();
  user: Signal<IMyChannelInfo | undefined>;
  authService = inject(Auth);
  logoMenuWidth = signal('236px');
  logoMenuPlaceHolder = computed(() =>
    !this.showStartHeader() && this.mode() === 'over'
      ? 'var(--logo-menu-width)'
      : '0px',
  );

  userEffect = effect(() => {
    const accessToken = this.authService.accessToken();
    this.dispatchAction(
      loginActionGroup.updateAccessToken({ accessToken: accessToken }),
    );
  });

  constructor() {
    super();
    this.user = this.selectSignal(selectMyChannelInfo);
  }
}
