import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

export enum ProtocolMode {
  AAD = 'AAD',
  OIDC = 'OIDC',
}

export interface MicrosoftOptions {
  redirect_uri?: string;
  logout_redirect_uri?: string;
  authority?: string;
  knownAuthorities?: string[];
  protocolMode?: ProtocolMode;
  clientCapabilities?: string[];
  cacheLocation?: string;
  scopes?: string[];
  prompt?: string;
}
interface MSALAccount {
  homeAccountId: string;
  username: string;
}
interface MSALLoginRequest {
  scopes?: string[];
  loginHint?: string;
  prompt?: string;
}
interface MSALLoginResponse {
  accessToken: string;
  account: MSALAccount;
  idToken: string;
  idTokenClaims?: { name?: string };
  uniqueId: string;
}
interface MSALClientApplication {
  getAllAccounts(): MSALAccount[];
  logoutPopup(request: {
    account: MSALAccount;
    postLogoutRedirectUri: string;
  }): Promise<void>;
  loginPopup(request: MSALLoginRequest): Promise<MSALLoginResponse>;
  ssoSilent(request: MSALLoginRequest): Promise<MSALLoginResponse>;
}
interface MSALConfig {
  auth: {
    clientId: string;
    redirectUri: string;
    authority?: string;
    knownAuthorities?: string[];
    clientCapabilities?: string[];
  };
  system: { protocolMode?: ProtocolMode };
  cache?: { cacheLocation: string };
}
declare const msal: {
  PublicClientApplication: new (config: MSALConfig) => MSALClientApplication;
};

export class MicrosoftLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'MICROSOFT';
  private instance?: MSALClientApplication;
  private readonly options: MicrosoftOptions;

  constructor(
    private readonly clientId: string,
    options: MicrosoftOptions = {},
  ) {
    super();
    this.options = {
      authority: 'https://login.microsoftonline.com/common/',
      scopes: ['openid', 'email', 'profile', 'User.Read'],
      knownAuthorities: [],
      protocolMode: ProtocolMode.AAD,
      clientCapabilities: [],
      cacheLocation: 'sessionStorage',
      ...options,
    };
  }

  async initialize(): Promise<void> {
    await this.loadScript(
      MicrosoftLoginProvider.PROVIDER_ID,
      'https://alcdn.msauth.net/browser/2.13.1/js/msal-browser.min.js',
      () => typeof msal !== 'undefined',
    );
    this.instance = new msal.PublicClientApplication({
      auth: {
        clientId: this.clientId,
        redirectUri: this.options.redirect_uri ?? location.origin,
        authority: this.options.authority,
        knownAuthorities: this.options.knownAuthorities,
        clientCapabilities: this.options.clientCapabilities,
      },
      system: { protocolMode: this.options.protocolMode },
      ...(this.options.cacheLocation
        ? { cache: { cacheLocation: this.options.cacheLocation } }
        : {}),
    });
  }

  async getLoginStatus(): Promise<ISocialUser> {
    const client = this.client;
    const account = client.getAllAccounts()[0];
    if (!account)
      throw new Error('No user is currently logged in with MICROSOFT');
    const response = await client.ssoSilent({
      scopes: this.options.scopes,
      loginHint: account.username,
    });
    return this.getISocialUser(response);
  }

  async signIn(options: MSALLoginRequest = {}): Promise<ISocialUser> {
    const response = await this.client.loginPopup({
      scopes: this.options.scopes,
      prompt: this.options.prompt,
      ...options,
    });
    return this.getISocialUser(response);
  }

  async signOut(): Promise<void> {
    const client = this.client;
    const account = client.getAllAccounts()[0];
    if (account) {
      await client.logoutPopup({
        account,
        postLogoutRedirectUri:
          this.options.logout_redirect_uri ??
          this.options.redirect_uri ??
          location.href,
      });
    }
  }

  private get client(): MSALClientApplication {
    if (!this.instance)
      throw new Error('Microsoft provider is not initialized');
    return this.instance;
  }

  private async getISocialUser(login: MSALLoginResponse): Promise<ISocialUser> {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${login.accessToken}` },
    });
    if (!response.ok)
      throw new Error(`Error retrieving Microsoft profile: ${response.status}`);
    const profile: { givenName?: string; surname?: string } =
      await response.json();
    return {
      provider: MicrosoftLoginProvider.PROVIDER_ID,
      id: login.uniqueId || login.account.homeAccountId,
      authToken: login.accessToken,
      name: login.idTokenClaims?.name,
      email: login.account.username,
      idToken: login.idToken,
      response: login,
      firstName: profile.givenName,
      lastName: profile.surname,
    };
  }
}
