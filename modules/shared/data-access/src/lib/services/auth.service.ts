import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionStorage } from './session-storage.service';
import { GoogleLoginProvider } from './social-login/providers/google-login-provider';
import { SocialAuthService } from './social-login/social-auth.service';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly authService = inject(SocialAuthService);
  private readonly sessionStorageService = inject(SessionStorage);
  private readonly token = signal(
    this.sessionStorageService.getItem('Authorization'),
  );
  private loginRequestId = 0;

  readonly accessToken = this.token.asReadonly();
  readonly isLoggedIn = computed(() => this.accessToken() !== null);

  constructor() {
    this.authService.authState.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (user) this.login();
      else this.clearSession();
    });
  }

  login(): void {
    const requestId = ++this.loginRequestId;
    void this.authService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        if (requestId === this.loginRequestId) this.token.set(accessToken);
      })
      .catch((error: unknown) => {
        if (requestId === this.loginRequestId) console.error(error);
      });
  }

  logout(): void {
    this.clearSession();
    void this.authService
      .signOut(false, GoogleLoginProvider.PROVIDER_ID)
      .catch((error: unknown) => console.error(error));
  }

  private clearSession(): void {
    ++this.loginRequestId;
    this.sessionStorageService.removeItem('Authorization');
    this.token.set(null);
  }
}
