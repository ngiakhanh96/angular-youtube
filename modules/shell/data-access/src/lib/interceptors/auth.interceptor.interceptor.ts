import { SessionStorage } from '@angular-youtube/shared-data-access';
import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Get the auth token from the service.
  const sessionStorageService = inject(SessionStorage);
  const authToken = sessionStorageService.getItem('Authorization');

  if (authToken != null) {
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
  }

  // send cloned request with header to the next handler.
  return next(req);
};
