import { Observable } from 'rxjs';
import { ILoginProvider } from '../login-provider';
import { ISocialUser } from '../social-user';

export abstract class BaseLoginProvider implements ILoginProvider {
  private static readonly scripts = new Map<string, Promise<void>>();

  readonly changeUser?: Observable<ISocialUser | null>;
  abstract initialize(autoLogin?: boolean, lang?: string): Promise<void>;
  abstract getLoginStatus(): Promise<ISocialUser>;
  abstract signIn(signInOptions?: object): Promise<ISocialUser>;
  abstract signOut(revoke?: boolean): Promise<void>;
  refreshToken?(): Promise<ISocialUser | null>;

  protected loadScript(
    id: string,
    src: string,
    isReady: () => boolean,
  ): Promise<void> {
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Login SDKs require a browser'));
    }
    if (isReady()) return Promise.resolve();
    const pending = BaseLoginProvider.scripts.get(id);
    if (pending) return pending;

    const request = new Promise<void>((resolve, reject) => {
      const existing = document.getElementById(id);
      if (existing && !(existing instanceof HTMLScriptElement)) {
        reject(new Error(`Login SDK element "${id}" is not a script`));
        return;
      }
      const script =
        existing instanceof HTMLScriptElement
          ? existing
          : document.createElement('script');
      const expectedSrc = new URL(src, document.baseURI).href;
      if (existing && script.src !== expectedSrc) {
        reject(new Error(`Login SDK "${id}" has a different source`));
        return;
      }

      const finish = (error?: Error) => {
        clearTimeout(timeout);
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);
        if (error) {
          script.remove();
          reject(error);
        } else {
          resolve();
        }
      };
      const onLoad = () =>
        finish(
          isReady() ? undefined : new Error(`Login SDK "${id}" is unavailable`),
        );
      const onError = () =>
        finish(new Error(`Failed to load login SDK "${id}"`));
      const timeout = setTimeout(
        () => finish(new Error(`Login SDK "${id}" timed out`)),
        15000,
      );
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      if (!existing) {
        script.id = id;
        script.async = true;
        script.src = expectedSrc;
        document.head.appendChild(script);
      } else if (isReady()) {
        finish();
      }
    });
    BaseLoginProvider.scripts.set(id, request);
    void request.catch(() => BaseLoginProvider.scripts.delete(id));
    return request;
  }
}
