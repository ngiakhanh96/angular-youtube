import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

/**
 * Protocol modes supported by MSAL.
 */
export enum ProtocolMode {
  AAD = 'AAD',
  OIDC = 'OIDC',
}

/**
 * Initialization Options for Microsoft Provider: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md
 * Details (not all options are supported): https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export type MicrosoftOptions = {
  redirect_uri?: string;
  logout_redirect_uri?: string;
  authority?: string;
  knownAuthorities?: string[];
  protocolMode?: ProtocolMode;
  clientCapabilities?: string[];
  cacheLocation?: string;
  scopes?: string[];
  prompt?: string;
};

// Collection of internal MSAL interfaces from: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser/src

interface MSALAccount {
  environment: string;
  homeAccountId: string;
  tenantId: string;
  username: string;
}

interface MSGraphUserInfo {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}

interface MSALLoginRequest {
  scopes?: string[];
  sid?: string;
  loginHint?: string;
  domainHint?: string;
  prompt?: string;
}

interface MSALLoginResponse {
  accessToken: string;
  account: MSALAccount;
  expiresOn: Date;
  extExpiresOn: Date;
  familyId: string;
  fromCache: boolean;
  idToken: string;
  idTokenClaims: any;
  scopes: string[];
  state: string;
  tenantId: string;
  uniqueId: string;
}

interface MSALLogoutRequest {
  account?: MSALAccount;
  postLogoutRedirectUri?: string;
  authority?: string;
  correlationId?: string;
}

interface MSALClientApplication {
  getAllAccounts(): MSALAccount[];
  logoutPopup(logoutRequest?: MSALLogoutRequest): Promise<void>;
  loginPopup(loginRequest: MSALLoginRequest): Promise<MSALLoginResponse>;
  ssoSilent(loginRequest: MSALLoginRequest): Promise<MSALLoginResponse>;
  acquireTokenSilent(
    loginRequest: MSALLoginRequest,
  ): Promise<MSALLoginResponse>;
  getAccountByHomeId(homeAccountId: string): MSALAccount;
}

declare let msal: any;

const COMMON_AUTHORITY = 'https://login.microsoftonline.com/common/';

/**
 * Microsoft Authentication using MSAL v2: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
 */
export class MicrosoftLoginProvider extends BaseLoginProvider {
  private _instance: MSALClientApplication | undefined;
  public static readonly PROVIDER_ID: string = 'MICROSOFT';

  private initOptions: MicrosoftOptions = {
    authority: COMMON_AUTHORITY,
    scopes: ['openid', 'email', 'profile', 'User.Read'],
    knownAuthorities: [],
    protocolMode: ProtocolMode.AAD,
    clientCapabilities: [],
    cacheLocation: 'sessionStorage',
  };

  constructor(
    private clientId: string,
    initOptions?: MicrosoftOptions,
  ) {
    super();

    this.initOptions = {
      ...this.initOptions,
      ...initOptions,
    };
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadScript(
        MicrosoftLoginProvider.PROVIDER_ID,
        'https://alcdn.msauth.net/browser/2.13.1/js/msal-browser.min.js',
        () => {
          try {
            const config = {
              auth: {
                clientId: this.clientId,
                redirectUri: this.initOptions.redirect_uri ?? location.origin,
                authority: this.initOptions.authority,
                knownAuthorities: this.initOptions.knownAuthorities,
                protocolMode: this.initOptions.protocolMode,
                clientCapabilities: this.initOptions.clientCapabilities,
              },
              cache: !this.initOptions.cacheLocation
                ? null
                : {
                    cacheLocation: this.initOptions.cacheLocation,
                  },
            };

            this._instance = new msal.PublicClientApplication(config);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
      );
    });
  }

  private getISocialUser(
    loginResponse: MSALLoginResponse,
  ): Promise<ISocialUser> {
    return new Promise<ISocialUser>((resolve, reject) => {
      //After login, use Microsoft Graph API to get user info
      const meRequest = new XMLHttpRequest();
      meRequest.onreadystatechange = () => {
        if (meRequest.readyState == 4) {
          try {
            if (meRequest.status == 200) {
              const userInfo = <MSGraphUserInfo>(
                JSON.parse(meRequest.responseText)
              );

              const user: ISocialUser = {
                provider: MicrosoftLoginProvider.PROVIDER_ID,
                id: loginResponse.idToken,
                authToken: loginResponse.accessToken,
                name: loginResponse.idTokenClaims.name,
                email: loginResponse.account.username,
                idToken: loginResponse.idToken,
                response: loginResponse,
                firstName: userInfo.givenName,
                lastName: userInfo.surname,
              };
              resolve(user);
            } else {
              reject(`Error retrieving user info: ${meRequest.status}`);
            }
          } catch (err) {
            reject(err);
          }
        }
      };

      //Microsoft Graph ME Endpoint: https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http
      meRequest.open('GET', 'https://graph.microsoft.com/v1.0/me');
      meRequest.setRequestHeader(
        'Authorization',
        `Bearer ${loginResponse.accessToken}`,
      );
      try {
        meRequest.send();
      } catch (err) {
        reject(err);
      }
    });
  }

  async getLoginStatus(): Promise<ISocialUser> {
    const accounts = this._instance!.getAllAccounts();
    if (accounts?.length > 0) {
      const loginResponse = await this._instance!.ssoSilent({
        scopes: this.initOptions.scopes,
        loginHint: accounts[0].username,
      });
      return await this.getISocialUser(loginResponse);
    } else {
      throw `No user is currently logged in with ${MicrosoftLoginProvider.PROVIDER_ID}`;
    }
  }

  async signIn(): Promise<ISocialUser> {
    const loginResponse = await this._instance!.loginPopup({
      scopes: this.initOptions.scopes,
      prompt: this.initOptions.prompt,
    });
    return await this.getISocialUser(loginResponse);
  }

  async signOut(revoke?: boolean): Promise<void> {
    const accounts = this._instance!.getAllAccounts();
    if (accounts?.length > 0) {
      await this._instance!.logoutPopup({
        account: accounts[0],
        postLogoutRedirectUri:
          this.initOptions.logout_redirect_uri ??
          this.initOptions.redirect_uri ??
          location.href,
      });
    }
  }
}
