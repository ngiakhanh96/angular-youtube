import { computed, inject, Injectable, signal } from '@angular/core';
import { SessionStorage } from './session-storage.service';
import { GoogleLoginProvider } from './social-login/providers/google-login-provider';
import { SocialAuthService } from './social-login/social-auth.service';

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
    this._accessToken.set(null);
  }

  public isLoggedIn = computed(() => {
    return this.accessToken() != null;
  });

  private _accessToken = signal(
    this.sessionStorageService.getItem('Authorization') != null
      ? this.sessionStorageService.getItem('Authorization')!
      : null,
  );
  public accessToken = computed(() => this._accessToken());
}
