import { ISocialUser } from '../social-user';
import { BaseLoginProvider } from './base-login-provider';

/** Local adapter for development without a remote identity service. */
export class DummyLoginProvider extends BaseLoginProvider {
  static readonly PROVIDER_ID = 'DUMMY';
  static readonly DEFAULT_USER: Readonly<ISocialUser> = {
    id: '1234567890',
    name: 'Mickey Mouse',
    email: 'mickey@mouse.com',
    firstName: 'Mickey',
    lastName: 'Mouse',
    authToken: 'dummyAuthToken',
    photoUrl: 'https://en.wikipedia.org/wiki/File:Mickey_Mouse.png',
    provider: 'DUMMY',
    idToken: 'dummyIdToken',
    authorizationCode: 'dummyAuthCode',
    response: {},
  };
  private loggedIn = false;
  private readonly user: ISocialUser;

  constructor(user: ISocialUser = DummyLoginProvider.DEFAULT_USER) {
    super();
    this.user = { ...user };
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  getLoginStatus(): Promise<ISocialUser> {
    return this.loggedIn
      ? Promise.resolve({ ...this.user })
      : Promise.reject(new Error('No user is currently logged in with DUMMY'));
  }

  signIn(): Promise<ISocialUser> {
    this.loggedIn = true;
    return Promise.resolve({ ...this.user });
  }

  signOut(): Promise<void> {
    this.loggedIn = false;
    return Promise.resolve();
  }
}
