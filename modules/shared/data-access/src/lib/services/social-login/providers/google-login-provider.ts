/// <reference types="google.accounts" />
import { Subject } from 'rxjs';
import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

export interface GoogleInitOptions {
  oneTapEnabled?: boolean;
  scopes?: string | string[];
  prompt_parent_id?: string;
  prompt?: '' | 'none' | 'consent' | 'select_account';
}

export class GoogleLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'GOOGLE';
  private readonly userChanges = new Subject<ISocialUser | null>();
  override readonly changeUser = this.userChanges.asObservable();
  private readonly options: GoogleInitOptions;
  private user: ISocialUser | null = null;
  private accessToken: string | null = null;
  private disposed = false;
  private pendingToken?: {
    promise: Promise<string>;
    reject: (error: unknown) => void;
  };

  constructor(
    private readonly clientId: string,
    options: GoogleInitOptions = {},
  ) {
    super();
    this.options = { oneTapEnabled: true, ...options };
  }

  async initialize(autoLogin = false, lang = ''): Promise<void> {
    const src =
      'https://accounts.google.com/gsi/client' +
      (lang ? `?hl=${encodeURIComponent(lang)}` : '');
    await this.loadScript(
      GoogleLoginProvider.PROVIDER_ID,
      src,
      () => typeof window.google?.accounts !== 'undefined',
    );
    if (this.disposed) return;

    this.accounts.id.initialize({
      client_id: this.clientId,
      auto_select: autoLogin,
      callback: ({ credential }) => {
        if (this.disposed) return;
        try {
          this.user = this.createSocialUser(credential);
          this.userChanges.next(this.user);
        } catch (error: unknown) {
          console.error(error);
        }
      },
      prompt_parent_id: this.options.prompt_parent_id,
      itp_support: this.options.oneTapEnabled,
      use_fedcm_for_prompt: this.options.oneTapEnabled,
    });
    if (this.options.oneTapEnabled) this.accounts.id.prompt();
  }

  getLoginStatus(): Promise<ISocialUser> {
    return this.user
      ? Promise.resolve(this.user)
      : Promise.reject(new Error('No user is currently logged in with GOOGLE'));
  }

  getAccessToken(): Promise<string> {
    if (this.pendingToken) return this.pendingToken.promise;
    if (this.disposed)
      return Promise.reject(new Error('Google provider has been disposed'));
    const scope = Array.isArray(this.options.scopes)
      ? this.options.scopes.filter(Boolean).join(' ')
      : this.options.scopes;
    if (!scope)
      return Promise.reject(
        new Error('Google access tokens require configured scopes'),
      );

    let resolveToken!: (token: string) => void;
    let rejectToken!: (error: unknown) => void;
    const promise = new Promise<string>((resolve, reject) => {
      resolveToken = resolve;
      rejectToken = reject;
    });
    const request = { promise, reject: rejectToken };
    this.pendingToken = request;

    const fail = (error: unknown) => {
      if (this.pendingToken !== request) return;
      this.pendingToken = undefined;
      rejectToken(error);
    };
    try {
      // Each request owns its callbacks, so a cancelled popup cannot resolve a later request.
      const client = this.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope,
        prompt: this.options.prompt,
        callback: (response) => {
          if (this.pendingToken !== request) return;
          if (response.error || !response.access_token) {
            fail(
              new Error(
                response.error_description ||
                  response.error ||
                  'Google did not return an access token',
              ),
            );
            return;
          }
          this.pendingToken = undefined;
          this.accessToken = response.access_token;
          resolveToken(response.access_token);
        },
        error_callback: (error) => fail(new Error(error.message || error.type)),
      });
      client.requestAccessToken({ login_hint: this.user?.email });
    } catch (error: unknown) {
      fail(error);
    }
    return promise;
  }

  revokeAccessToken(): Promise<void> {
    const token = this.accessToken;
    if (!token) return Promise.reject(new Error('No access token to revoke'));
    return this.revokeToken(token).then(() => {
      if (this.accessToken === token) this.accessToken = null;
    });
  }

  signIn(): Promise<ISocialUser> {
    return Promise.reject(
      new Error(
        'Use google.accounts.id.renderButton() for Google identity sign-in, or getAccessToken() for OAuth access.',
      ),
    );
  }

  async signOut(revoke = false): Promise<void> {
    const token = this.accessToken;
    this.cancelTokenRequest();
    this.accessToken = null;
    this.user = null;
    this.userChanges.next(null);
    this.accounts.id.disableAutoSelect();
    this.accounts.id.cancel();
    if (revoke && token) {
      await this.revokeToken(token);
    }
  }

  dispose(): void {
    this.disposed = true;
    this.cancelTokenRequest();
    if (typeof window !== 'undefined' && window.google?.accounts)
      window.google.accounts.id.cancel();
    this.userChanges.complete();
  }

  private cancelTokenRequest(): void {
    const pending = this.pendingToken;
    this.pendingToken = undefined;
    pending?.reject(new Error('Google access token request was cancelled'));
  }

  private revokeToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // The installed Google types omit the response argument documented by GIS.
      this.accounts.oauth2.revoke(
        token,
        (response?: {
          successful: boolean;
          error?: string;
          error_description?: string;
        }) => {
          if (
            response?.successful === false &&
            response.error !== 'invalid_token'
          ) {
            reject(
              new Error(
                response.error_description ||
                  response.error ||
                  'Google token revocation failed',
              ),
            );
          } else {
            resolve();
          }
        },
      );
    });
  }

  private get accounts(): typeof google.accounts {
    if (typeof window === 'undefined' || !window.google?.accounts) {
      throw new Error('Google Accounts API is unavailable');
    }
    return window.google.accounts;
  }

  private createSocialUser(idToken: string): ISocialUser {
    const payload = this.decodeJwt(idToken);
    return {
      idToken,
      id: payload['sub'],
      name: payload['name'],
      email: payload['email'],
      photoUrl: payload['picture'],
      firstName: payload['given_name'],
      lastName: payload['family_name'],
    };
  }

  private decodeJwt(idToken: string): Record<string, string> {
    const encoded = idToken.split('.')[1];
    if (!encoded) throw new Error('Google returned an invalid ID token');
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (character) =>
      character.charCodeAt(0),
    );
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Google returned an invalid ID token payload');
    }
    // These claims are display data, not proof of authentication.
    return Object.fromEntries(
      Object.entries(payload).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    );
  }
}
