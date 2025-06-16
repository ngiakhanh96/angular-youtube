import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

declare let amazon: any, window: any;

export class AmazonLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID: string = 'AMAZON';

  constructor(
    private clientId: string,
    private initOptions: any = {
      scope: 'profile',
      scope_data: {
        profile: { essential: false },
      },
      redirect_uri: location.origin,
    },
  ) {
    super();
  }

  initialize(): Promise<void> {
    let amazonRoot = null;
    if (document) {
      amazonRoot = document.createElement('div');
      amazonRoot.id = 'amazon-root';
      document.body.appendChild(amazonRoot);
    }

    window.onAmazonLoginReady = () => {
      amazon.Login.setClientId(this.clientId);
    };

    return new Promise((resolve, reject) => {
      try {
        this.loadScript(
          'amazon-login-sdk',
          'https://assets.loginwithamazon.com/sdk/na/login1.js',
          () => {
            resolve();
          },
          amazonRoot,
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  getLoginStatus(): Promise<ISocialUser> {
    return new Promise((resolve, reject) => {
      const token = this.retrieveToken();

      if (token) {
        amazon.Login.retrieveProfile(
          token,
          (response: {
            success: boolean;
            profile: { CustomerId: string; Name: string; PrimaryEmail: string };
            error: any;
          }) => {
            if (response.success) {
              const user: ISocialUser = {
                id: response.profile.CustomerId,
                name: response.profile.Name,
                email: response.profile.PrimaryEmail,
                response: response.profile,
              };

              resolve(user);
            } else {
              reject(response.error);
            }
          },
        );
      } else {
        reject(
          `No user is currently logged in with ${AmazonLoginProvider.PROVIDER_ID}`,
        );
      }
    });
  }

  signIn(signInOptions?: any): Promise<ISocialUser> {
    const options = { ...this.initOptions, ...signInOptions };
    return new Promise((resolve, reject) => {
      amazon.Login.authorize(
        options,
        (authResponse: { error: any; access_token: string | undefined }) => {
          if (authResponse.error) {
            reject(authResponse.error);
          } else {
            amazon.Login.retrieveProfile(
              authResponse.access_token,
              (response: {
                profile: {
                  CustomerId: string;
                  Name: string;
                  PrimaryEmail: string;
                };
              }) => {
                const user: ISocialUser = {
                  id: response.profile.CustomerId,
                  name: response.profile.Name,
                  email: response.profile.PrimaryEmail,
                  authToken: authResponse.access_token,
                  response: response.profile,
                };

                this.persistToken(authResponse.access_token);

                resolve(user);
              },
            );
          }
        },
      );
    });
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        amazon.Login.logout();

        this.clearToken();
        resolve();
      } catch (err: any) {
        reject(err.message);
      }
    });
  }

  private persistToken(token: string | undefined): void {
    localStorage.setItem(
      `${AmazonLoginProvider.PROVIDER_ID}_token`,
      token || '',
    );
  }

  private retrieveToken(): string | null {
    return localStorage.getItem(`${AmazonLoginProvider.PROVIDER_ID}_token`);
  }

  private clearToken(): void {
    localStorage.removeItem(`${AmazonLoginProvider.PROVIDER_ID}_token`);
  }
}
