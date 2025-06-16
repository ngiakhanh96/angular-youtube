import { EventEmitter } from '@angular/core';
import { ILoginProvider } from '../login-provider';
import { ISocialUser } from '../social-user';

export abstract class BaseLoginProvider implements ILoginProvider {
  readonly changeUser?: EventEmitter<ISocialUser>;
  abstract initialize(autoLogin?: boolean, lang?: string): Promise<void>;
  abstract getLoginStatus(): Promise<ISocialUser>;
  abstract signIn(signInOptions?: object): Promise<ISocialUser>;
  abstract signOut(revoke?: boolean): Promise<void>;
  refreshToken?(): Promise<ISocialUser | null>;

  protected loadScript(
    id: string,
    src: string,
    onload: any,
    parentElement: HTMLElement | null = null,
  ): void {
    // get document if platform is only browser
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const signInJS = document.createElement('script');

      signInJS.async = true;
      signInJS.src = src;
      signInJS.onload = onload;

      if (!parentElement) {
        parentElement = document.head;
      }

      parentElement.appendChild(signInJS);
    }
  }
}
