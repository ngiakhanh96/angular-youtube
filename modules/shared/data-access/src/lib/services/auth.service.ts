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
  public login() {
    this.authService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this._accessToken.set(accessToken);
      });
  }

  public logout() {
    this.sessionStorageService.removeItem('Authorization');
    this._accessToken.set(undefined);
  }

  public isLoggedIn = computed(() => {
    return this.accessToken() != null;
  });

  private _accessToken = signal(
    this.sessionStorageService.getItem('Authorization') != null
      ? this.sessionStorageService.getItem('Authorization')!
      : undefined,
  );
  public accessToken = computed(() => this._accessToken());
}
