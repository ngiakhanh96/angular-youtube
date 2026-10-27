import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  makeEnvironmentProviders,
  NgZone,
  PLATFORM_ID,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncSubject, ReplaySubject } from 'rxjs';
import { ILoginProvider } from './login-provider';
import { ISocialUser } from './social-user';

export interface SocialAuthServiceConfig {
  autoLogin?: boolean;
  lang?: string;
  providers: { id: string; provider: ILoginProvider | Type<ILoginProvider> }[];
  onError?: (error: unknown) => void;
}

const SOCIAL_AUTH_SERVICE_CONFIG = new InjectionToken<SocialAuthServiceConfig>(
  'SocialAuthServiceConfig',
);

export function provideSocialAuth(config: SocialAuthServiceConfig) {
  return makeEnvironmentProviders([
    SocialAuthService,
    { provide: SOCIAL_AUTH_SERVICE_CONFIG, useValue: config },
  ]);
}

/** Coordinates providers; SDK details and token capabilities belong to adapters. */
@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  private readonly config = inject(SOCIAL_AUTH_SERVICE_CONFIG);
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly providers = new Map<string, ILoginProvider>();
  private readonly providerErrors = new Map<string, unknown>();
  private readonly authStateSubject = new ReplaySubject<ISocialUser | null>(1);
  private readonly initStateSubject = new AsyncSubject<boolean>();
  private user: ISocialUser | null = null;
  private sessionVersion = 0;

  readonly authState = this.authStateSubject.asObservable();
  readonly initState = this.initStateSubject.asObservable();
  private readonly ready: Promise<void>;

  constructor() {
    this.ready = this.initialize();
    this.destroyRef.onDestroy(() => {
      ++this.sessionVersion;
      for (const provider of this.providers.values()) provider.dispose?.();
      this.authStateSubject.complete();
      this.initStateSubject.complete();
    });
  }

  async getAccessToken(providerId: string): Promise<string | null> {
    const provider = await this.getProvider(providerId);
    if (!provider.getAccessToken) {
      throw new Error('Chosen login provider does not support access tokens');
    }
    return provider.getAccessToken();
  }

  async refreshAuthToken(providerId: string): Promise<void> {
    const version = this.sessionVersion;
    const provider = await this.getProvider(providerId);
    if (!provider.refreshToken) {
      throw new Error(
        'Chosen login provider does not support refreshing a token',
      );
    }
    const user = await provider.refreshToken();
    if (version === this.sessionVersion) this.setUser(user, providerId);
  }

  async revokeAccessToken(providerId: string): Promise<void> {
    const provider = await this.getProvider(providerId);
    if (!provider.revokeAccessToken) {
      throw new Error(
        'Chosen login provider does not support revoking an access token',
      );
    }
    await provider.revokeAccessToken();
  }

  async signIn(providerId: string, options?: object): Promise<ISocialUser> {
    const version = ++this.sessionVersion;
    const provider = await this.getProvider(providerId);
    if (version !== this.sessionVersion)
      throw new Error('Sign-in was cancelled');
    const user = { ...(await provider.signIn(options)), provider: providerId };
    if (version !== this.sessionVersion)
      throw new Error('Sign-in was cancelled');
    this.setUser(user);
    return user;
  }

  async signOut(revoke = false, providerId?: string): Promise<void> {
    const version = ++this.sessionVersion;
    const id = providerId ?? this.user?.provider;
    if (!id) throw new Error('Not logged in');
    const provider = await this.getProvider(id);
    await provider.signOut(revoke);
    if (version === this.sessionVersion) this.setUser(null);
  }

  private async initialize(): Promise<void> {
    if (!this.isBrowser) {
      this.initStateSubject.next(false);
      this.initStateSubject.complete();
      return;
    }

    const results = await Promise.allSettled(
      this.config.providers.map(async ({ id, provider: entry }) => {
        try {
          if (this.providers.has(id))
            throw new Error(`Duplicate login provider "${id}"`);
          const provider =
            typeof entry === 'function' ? this.injector.get(entry) : entry;
          this.providers.set(id, provider);
          provider.changeUser
            ?.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
              this.zone.run(() => this.setUser(user, id));
            });
          await provider.initialize(
            this.config.autoLogin ?? false,
            this.config.lang ?? '',
          );
        } catch (error: unknown) {
          this.providerErrors.set(id, error);
          (this.config.onError ?? console.error)(error);
          throw error;
        }
      }),
    );

    if (this.destroyRef.destroyed) return;
    this.initStateSubject.next(
      results.every((result) => result.status === 'fulfilled'),
    );
    this.initStateSubject.complete();

    if (this.config.autoLogin) {
      const version = this.sessionVersion;
      const statuses = await Promise.allSettled(
        [...this.providers]
          .filter(([id]) => !this.providerErrors.has(id))
          .map(async ([id, provider]) => {
            const user = await provider.getLoginStatus();
            if (version === this.sessionVersion) this.setUser(user, id);
          }),
      );
      if (
        version === this.sessionVersion &&
        !this.user &&
        statuses.every((status) => status.status === 'rejected')
      ) {
        this.setUser(null);
      }
    }
  }

  private async getProvider(id: string): Promise<ILoginProvider> {
    await this.ready;
    if (this.destroyRef.destroyed)
      throw new Error('Social auth service has been destroyed');
    if (!this.isBrowser) throw new Error('Login requires a browser');
    if (this.providerErrors.has(id)) throw this.providerErrors.get(id);
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Login provider "${id}" not found`);
    return provider;
  }

  private setUser(user: ISocialUser | null, id?: string): void {
    if (this.destroyRef.destroyed) return;
    this.user = user ? { ...user, provider: id ?? user.provider } : null;
    this.authStateSubject.next(this.user);
  }
}
