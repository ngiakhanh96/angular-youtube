import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

interface AmazonOptions {
  scope?: string | string[];
  scope_data?: Record<string, { essential: boolean }>;
  redirect_uri?: string;
}
interface AmazonProfile {
  CustomerId: string;
  Name: string;
  PrimaryEmail: string;
}
interface AmazonProfileResponse {
  success: boolean;
  profile?: AmazonProfile;
  error?: string;
}
interface AmazonAuthorization {
  access_token?: string;
  error?: string;
}
interface AmazonSdk {
  Login: {
    setClientId(clientId: string): void;
    authorize(
      options: AmazonOptions,
      callback: (response: AmazonAuthorization) => void,
    ): void;
    retrieveProfile(
      token: string,
      callback: (response: AmazonProfileResponse) => void,
    ): void;
    logout(): void;
  };
}
declare const amazon: AmazonSdk;

export class AmazonLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'AMAZON';
  private readonly options: AmazonOptions;

  constructor(
    private readonly clientId: string,
    options: AmazonOptions = {},
  ) {
    super();
    this.options = {
      scope: 'profile',
      scope_data: { profile: { essential: false } },
      ...options,
    };
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined')
      throw new Error('Amazon login requires a browser');
    if (!document.getElementById('amazon-root')) {
      const root = document.createElement('div');
      root.id = 'amazon-root';
      document.body.prepend(root);
    }
    const target = window as Window & { onAmazonLoginReady?: () => void };
    const previous = target.onAmazonLoginReady;
    const onReady = () => {
      previous?.();
      amazon.Login.setClientId(this.clientId);
    };
    target.onAmazonLoginReady = onReady;
    try {
      await this.loadScript(
        'amazon-login-sdk',
        'https://assets.loginwithamazon.com/sdk/na/login1.js',
        () => typeof amazon !== 'undefined' && !!amazon.Login,
      );
      amazon.Login.setClientId(this.clientId);
    } finally {
      if (target.onAmazonLoginReady === onReady)
        target.onAmazonLoginReady = previous;
    }
  }

  getLoginStatus(): Promise<ISocialUser> {
    const token = localStorage.getItem(
      `${AmazonLoginProvider.PROVIDER_ID}_token`,
    );
    return token
      ? this.getUser(token)
      : Promise.reject(new Error('No user is currently logged in with AMAZON'));
  }

  async signIn(options: AmazonOptions = {}): Promise<ISocialUser> {
    const token = await new Promise<string>((resolve, reject) => {
      amazon.Login.authorize(
        {
          ...this.options,
          redirect_uri: this.options.redirect_uri ?? location.origin,
          ...options,
        },
        (response) => {
          if (response.error || !response.access_token)
            reject(
              new Error(
                response.error || 'Amazon did not return an access token',
              ),
            );
          else resolve(response.access_token);
        },
      );
    });
    const user = await this.getUser(token);
    localStorage.setItem(`${AmazonLoginProvider.PROVIDER_ID}_token`, token);
    return user;
  }

  signOut(): Promise<void> {
    return Promise.resolve().then(() => {
      try {
        amazon.Login.logout();
      } finally {
        localStorage.removeItem(`${AmazonLoginProvider.PROVIDER_ID}_token`);
      }
    });
  }

  private getUser(token: string): Promise<ISocialUser> {
    return new Promise((resolve, reject) => {
      amazon.Login.retrieveProfile(token, (response) => {
        if (!response.success || !response.profile) {
          reject(
            new Error(response.error || 'Failed to retrieve Amazon profile'),
          );
          return;
        }
        const profile = response.profile;
        resolve({
          id: profile.CustomerId,
          name: profile.Name,
          email: profile.PrimaryEmail,
          authToken: token,
          response: profile,
        });
      });
    });
  }
}
