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
  effect,
  inject,
  input,
  Signal,
} from '@angular/core';

@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  standalone: true,
  imports: [LogoMenuComponent, CenterHeaderComponent, EndHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterHeaderComponent extends BaseWithSandBoxComponent {
  showStartHeader = input.required();
  user: Signal<IMyChannelInfo | undefined>;
  authService = inject(Auth);

  userEffect = effect(() => {
    const accessToken = this.authService.accessToken();
    if (accessToken) {
      this.dispatchAction(
        loginActionGroup.updateAccessToken({ accessToken: accessToken }),
      );
    }
  });

  constructor() {
    super();
    this.user = this.selectSignal(selectMyChannelInfo);
  }
}
