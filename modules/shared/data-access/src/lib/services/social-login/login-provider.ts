import { Observable } from 'rxjs';
import { ISocialUser } from './social-user';

export interface ILoginProvider {
  readonly changeUser?: Observable<ISocialUser | null>;
  initialize(autoLogin?: boolean, lang?: string): Promise<void>;
  getLoginStatus(): Promise<ISocialUser>;
  signIn(signInOptions?: object): Promise<ISocialUser>;
  signOut(revoke?: boolean): Promise<void>;
  refreshToken?(): Promise<ISocialUser | null>;
  getAccessToken?(): Promise<string | null>;
  revokeAccessToken?(): Promise<void>;
  dispose?(): void;
}
