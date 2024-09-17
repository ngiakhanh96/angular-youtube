import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
  StartHeaderComponent,
} from '@angular-youtube/header-ui';
import {
  BaseWithSandBoxComponent,
  commonActionGroup,
} from '@angular-youtube/shared-data-access';
import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  standalone: true,
  imports: [
    StartHeaderComponent,
    CenterHeaderComponent,
    EndHeaderComponent,
    AsyncPipe,
  ],
})
export class MasterHeaderComponent extends BaseWithSandBoxComponent {
  protected authService = inject(SocialAuthService);
  protected user: Signal<SocialUser | null> = toSignal(
    this.authService.authState,
    { initialValue: null }
  );
  userEffect = effect(() => {
    const user = this.user();
    this.dispatchAction(
      commonActionGroup.updateAccessToken({ accessToken: user?.authToken })
    );
  });
  constructor() {
    super();
  }
}
