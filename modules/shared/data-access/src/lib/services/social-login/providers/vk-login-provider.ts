import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

const permissionTypes = {
  notify: 1,
  friends: 2,
  photos: 4,
  audio: 8,
  video: 16,
  offers: 32,
  questions: 64,
  pages: 128,
  links: 256,
  status: 1024,
  notes: 2048,
  messages: 4096,
  wall: 8192,
  ads: 32768,
  offline: 65536,
  docs: 131072,
  groups: 262144,
  notifications: 524288,
  stats: 1048576,
  email: 4194304,
  market: 134217728,
} as const;
type PermissionType = keyof typeof permissionTypes;
interface VKLoginResponse {
  status: string;
  session?: { mid: number; sid: string };
}
interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_max?: string;
}
interface VKUserResponse {
  response?: VKUser[];
  error?: { error_msg: string };
}
interface VKOptions {
  fields: string;
  version: string;
}
interface VKSdk {
  init(options: { apiId: string }): void;
  Auth: {
    login(callback: (response: VKLoginResponse) => void, scope: number): void;
    getLoginStatus(callback: (response: VKLoginResponse) => void): void;
    logout(callback: () => void): void;
  };
  Api: {
    call(
      method: string,
      options: { user_id: number; fields: string; v: string },
      callback: (response: VKUserResponse) => void,
    ): void;
  };
}
declare const VK: VKSdk;

export class VKLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'VK';

  constructor(
    private readonly clientId: string,
    private readonly initOptions: VKOptions = {
      fields: 'photo_max,contacts',
      version: '5.131',
    },
  ) {
    super();
  }

  async initialize(): Promise<void> {
    await this.loadScript(
      VKLoginProvider.PROVIDER_ID,
      'https://vk.com/js/api/openapi.js',
      () => typeof VK !== 'undefined',
    );
    VK.init({ apiId: this.clientId });
  }

  async getLoginStatus(): Promise<ISocialUser> {
    const session = await new Promise<NonNullable<VKLoginResponse['session']>>(
      (resolve, reject) => {
        VK.Auth.getLoginStatus((response) => {
          if (response.status === 'connected' && response.session)
            resolve(response.session);
          else reject(new Error('No user is currently logged in with VK'));
        });
      },
    );
    return this.getUser(session.mid, session.sid);
  }

  async signIn(permissions: string[] = []): Promise<ISocialUser> {
    const scope = permissions.reduce(
      (mask, permission) =>
        Object.hasOwn(permissionTypes, permission)
          ? mask | permissionTypes[permission as PermissionType]
          : mask,
      0,
    );
    const session = await new Promise<NonNullable<VKLoginResponse['session']>>(
      (resolve, reject) => {
        VK.Auth.login((response) => {
          if (response.status === 'connected' && response.session)
            resolve(response.session);
          else reject(new Error('VK login was cancelled or not authorized'));
        }, scope);
      },
    );
    return this.getUser(session.mid, session.sid);
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => VK.Auth.logout(resolve));
  }

  private getUser(userId: number, token: string): Promise<ISocialUser> {
    return new Promise((resolve, reject) => {
      VK.Api.call(
        'users.get',
        {
          user_id: userId,
          fields: this.initOptions.fields,
          v: this.initOptions.version,
        },
        (response) => {
          const user = response.response?.[0];
          if (response.error || !user) {
            reject(
              new Error(
                response.error?.error_msg || 'Failed to retrieve VK profile',
              ),
            );
            return;
          }
          resolve({
            id: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            firstName: user.first_name,
            lastName: user.last_name,
            photoUrl: user.photo_max,
            authToken: token,
            response: user,
          });
        },
      );
    });
  }
}
