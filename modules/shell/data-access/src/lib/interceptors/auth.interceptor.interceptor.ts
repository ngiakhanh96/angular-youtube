import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Get the auth token from the service.
  const cookieService = inject(SsrCookieService);
  if (cookieService.check('Authorization')) {
    const authToken = cookieService.get('Authorization');

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (authToken != null) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
    }
  }

  // send cloned request with header to the next handler.
  return next(req);
};
