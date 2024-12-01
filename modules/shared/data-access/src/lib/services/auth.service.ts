import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { computed, inject, Injectable, signal } from '@angular/core';
import { SessionStorage } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private authService = inject(SocialAuthService);
  private sessionStorageService = inject(SessionStorage);
  public getAccessToken() {
    this.authService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this._accessToken.set(accessToken);
      });
  }

  private _accessToken = signal(
    this.sessionStorageService.getItem('Authorization') != null
      ? this.sessionStorageService.getItem('Authorization')!
      : undefined,
  );
  public accessToken = computed(() => this._accessToken());
}
