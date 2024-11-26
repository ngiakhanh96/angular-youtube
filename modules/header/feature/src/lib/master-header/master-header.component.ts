import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import {
  Auth,
  BaseWithSandBoxComponent,
} from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
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
  protected authService = inject(Auth);

  userEffect = effect(() => {
    const user = this.authService.user();
    console.log(user);
    this.dispatchAction(loginActionGroup.updateAccessToken({ user: user }));
  });
}
