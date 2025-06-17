import { EventEmitter } from '@angular/core';
import { ISocialUser } from './social-user';

export interface ILoginProvider {
  readonly changeUser?: EventEmitter<ISocialUser | null>;
  initialize(autoLogin?: boolean, lang?: string): Promise<void>;
  getLoginStatus(): Promise<ISocialUser>;
  signIn(signInOptions?: object): Promise<ISocialUser>;
  signOut(revoke?: boolean): Promise<void>;
  refreshToken?(): Promise<ISocialUser | null>;
}
