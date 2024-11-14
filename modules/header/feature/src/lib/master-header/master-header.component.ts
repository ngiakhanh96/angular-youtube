import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { loginActionGroup } from 'modules/shared/data-access/src/lib/store/common/actions/common.action-group';

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
  protected authService = inject(SocialAuthService);
  protected user: Signal<SocialUser | null> = toSignal(
    this.authService.authState,
    { initialValue: null },
  );
  userEffect = effect(() => {
    const user = this.user();
    console.log(user);
    this.dispatchAction(
      loginActionGroup.updateAccessToken({ accessToken: user?.idToken }),
    );
  });
}
