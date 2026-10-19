import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

interface FacebookOptions {
  scope?: string;
  locale?: string;
  fields?: string;
  version?: string;
}
interface FacebookLoginResponse {
  status?: string;
  authResponse?: { accessToken: string };
}
interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  error?: { message: string };
}
interface FacebookSdk {
  init(options: {
    appId: string;
    autoLogAppEvents: boolean;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }): void;
  getLoginStatus(callback: (response: FacebookLoginResponse) => void): void;
  login(
    callback: (response: FacebookLoginResponse) => void,
    options: FacebookOptions,
  ): void;
  logout(callback: () => void): void;
  api(path: string, callback: (response: FacebookUser) => void): void;
}
declare const FB: FacebookSdk;

export class FacebookLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'FACEBOOK';
  private readonly options: Required<FacebookOptions>;

  constructor(
    private readonly clientId: string,
    options: FacebookOptions = {},
  ) {
    super();
    this.options = {
      scope: 'email,public_profile',
      locale: 'en_US',
      fields: 'name,email,picture,first_name,last_name',
      version: 'v10.0',
      ...options,
    };
  }

  async initialize(): Promise<void> {
    await this.loadScript(
      FacebookLoginProvider.PROVIDER_ID,
      `https://connect.facebook.net/${encodeURIComponent(this.options.locale)}/sdk.js`,
      () => typeof FB !== 'undefined',
    );
    FB.init({
      appId: this.clientId,
      autoLogAppEvents: true,
      cookie: true,
      xfbml: true,
      version: this.options.version,
    });
  }

  async getLoginStatus(): Promise<ISocialUser> {
    const token = await new Promise<string>((resolve, reject) => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected' && response.authResponse)
          resolve(response.authResponse.accessToken);
        else reject(new Error('No user is currently logged in with FACEBOOK'));
      });
    });
    return this.getUser(token, this.options.fields);
  }

  async signIn(options: FacebookOptions = {}): Promise<ISocialUser> {
    const request = { ...this.options, ...options };
    const token = await new Promise<string>((resolve, reject) => {
      FB.login((response) => {
        if (response.authResponse) resolve(response.authResponse.accessToken);
        else
          reject(new Error('Facebook login was cancelled or not authorized'));
      }, request);
    });
    return this.getUser(token, request.fields);
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => FB.logout(resolve));
  }

  private getUser(token: string, fields: string): Promise<ISocialUser> {
    return new Promise((resolve, reject) => {
      FB.api(`/me?fields=${encodeURIComponent(fields)}`, (user) => {
        if (user.error || !user.id) {
          reject(
            new Error(
              user.error?.message || 'Failed to retrieve Facebook profile',
            ),
          );
          return;
        }
        resolve({
          id: user.id,
          name: user.name,
          email: user.email,
          photoUrl: `https://graph.facebook.com/${encodeURIComponent(user.id)}/picture?type=normal`,
          firstName: user.first_name,
          lastName: user.last_name,
          authToken: token,
          response: user,
        });
      });
    });
  }
}
