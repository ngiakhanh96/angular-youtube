import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

declare let FB: any;

export class FacebookLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID: string = 'FACEBOOK';

  private requestOptions = {
    scope: 'email,public_profile',
    locale: 'en_US',
    fields: 'name,email,picture,first_name,last_name',
    version: 'v10.0',
  };

  constructor(
    private clientId: string,
    initOptions: object = {},
  ) {
    super();

    this.requestOptions = {
      ...this.requestOptions,
      ...initOptions,
    };
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.loadScript(
          FacebookLoginProvider.PROVIDER_ID,
          `//connect.facebook.net/${this.requestOptions.locale}/sdk.js`,
          () => {
            FB.init({
              appId: this.clientId,
              autoLogAppEvents: true,
              cookie: true,
              xfbml: true,
              version: this.requestOptions.version,
            });

            resolve();
          },
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  getLoginStatus(): Promise<ISocialUser> {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          const authResponse = response.authResponse;
          FB.api(`/me?fields=${this.requestOptions.fields}`, (fbUser: any) => {
            const user: ISocialUser = {
              id: fbUser.id,
              name: fbUser.name,
              email: fbUser.email,
              photoUrl:
                'https://graph.facebook.com/' +
                fbUser.id +
                '/picture?type=normal&access_token=' +
                authResponse.accessToken,
              firstName: fbUser.first_name,
              lastName: fbUser.last_name,
              authToken: authResponse.accessToken,

              response: fbUser,
            };

            resolve(user);
          });
        } else {
          reject(
            `No user is currently logged in with ${FacebookLoginProvider.PROVIDER_ID}`,
          );
        }
      });
    });
  }

  signIn(signInOptions?: any): Promise<ISocialUser> {
    const options = { ...this.requestOptions, ...signInOptions };
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          const authResponse = response.authResponse;
          FB.api(`/me?fields=${options.fields}`, (fbUser: any) => {
            const user: ISocialUser = {
              id: fbUser.id,
              name: fbUser.name,
              email: fbUser.email,
              photoUrl:
                'https://graph.facebook.com/' +
                fbUser.id +
                '/picture?type=normal',
              firstName: fbUser.first_name,
              lastName: fbUser.last_name,
              authToken: authResponse.accessToken,
              response: fbUser,
            };

            resolve(user);
          });
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, options);
    });
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      FB.logout((response: any) => {
        resolve();
      });
    });
  }
}
