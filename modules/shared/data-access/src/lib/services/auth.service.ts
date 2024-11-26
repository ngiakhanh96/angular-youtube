import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionStorage } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private authService = inject(SocialAuthService);
  private sessionStorageService = inject(SessionStorage);
  public user: Signal<SocialUser | undefined> = toSignal(
    this.authService.authState,
    {
      initialValue:
        this.sessionStorageService.getItem('Authorization') != null
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            JSON.parse(this.sessionStorageService.getItem('Authorization')!)
          : undefined,
    },
  );
}
